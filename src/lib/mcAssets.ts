/*
 * SPDX-License-Identifier: AGPL-3.0-only
 * Copyright (c) 2025 UserDerezzed
 *
 * This file is part of MyPet-SkilltreeCreator.
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License, version 3 only.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License along with this program. See the LICENSE.md file for details.
 */

/*
  mcAssets.ts — Unified helpers for online Minecraft resources

  Overview
  - This module centralizes URLs and lightweight fetchers for two external sources:
    1) mcasset.cloud (textures/models) — used for images like item textures and effect icons
       Base: https://assets.mcasset.cloud/latest/
    2) PrismarineJS minecraft-data (JSON) — used for game data such as effects and entities
       Base: https://raw.githubusercontent.com/PrismarineJS/minecraft-data/refs/heads/master/data

  Organization
  - Section A: mcasset.cloud (assets) helpers and utilities are grouped together.
  - Section B: Prismarine (minecraft-data) helpers, discovery logic, and data access (McData).

  Notes
  - We intentionally do NOT hardcode a specific minecraft-data version. Instead, we discover
    the latest "pc" version by reading dataPaths.json and selecting the entry whose
    proto === 'pc/latest'.
  - All functions are small and defensive. Network failures return null rather than throwing.
  - Public API is stable: mcAssetsBase, assetUrl, effectIconUrl, MCDATA_BASE, McData, toSnakeId, types.
*/

import { titleFromName, toCamelId, toSnakeId } from './mcUtil'

// Re-export for convenience: UI code frequently needs toSnakeId
export { toSnakeId }

// ============================================================================
// Plugin Compatibility — Entity blacklist and ID overrides
// ============================================================================

/**
 * Entities that cannot be kept as MyPet companions.
 * These are filtered out of the mob selection list entirely.
 * Key: Minecraft entity name (snake_case as returned by PrismarineJS)
 */
export const BLACKLISTED_MOBS = new Set(['shulker'])

/**
 * MyPet uses different internal IDs than Minecraft for some mobs.
 * This maps Minecraft entity names to the MyPet-expected ID.
 * Key: Minecraft entity name (snake_case)
 * Value: MyPet internal ID (used in .st.json exports)
 */
export const MOB_ID_OVERRIDES: Record<string, string> = {
  'snow_golem': 'Snowman',
}

// ============================================================================
// Section A — mcasset.cloud (textures/models/images)
// ============================================================================

/**
 * Base URL for mcasset.cloud. We pin to the "latest" channel.
 * Example: `${ASSETS_BASE}assets/minecraft/textures/item/diamond_sword.png`
 */
export const ASSETS_BASE = 'https://assets.mcasset.cloud/latest'

/**
 * Returns the base URL for mcasset.cloud assets. Kept as a function for parity with callers
 * that expect a function (e.g., in renderers) and to allow future configurability.
 */
export function mcAssetsBase(): string { return ASSETS_BASE }

/**
 * Builds a fully-qualified mcasset.cloud URL for an asset-relative path.
 * - Leading slashes in `path` are trimmed.
 * - The base already ends with a trailing slash; an extra slash is injected for safety.
 *
 * Example:
 *   assetUrl('assets/minecraft/textures/block/stone.png')
 *   → https://assets.mcasset.cloud/latest/assets/minecraft/textures/block/stone.png
 */
export function assetUrl(path: string): string {
  const p = path.replace(/^\/+/, '')
  return `${ASSETS_BASE}/${p}`
}

/**
 * Returns the URL for a mob effect icon PNG.
 *
 * Example:
 *   effectIconUrl('Jump Boost')
 *   → https://assets.mcasset.cloud/latest/assets/minecraft/textures/mob_effect/jump_boost.png
 */
export function effectIconUrl(effect: string): string {
  const id = toSnakeId(effect)
  return assetUrl(`assets/minecraft/textures/mob_effect/${id}.png`)
}

// ============================================================================
// Section B — PrismarineJS minecraft-data (JSON)
// ============================================================================

/**
 * Root base for all PrismarineJS minecraft-data JSON fetches.
 * We always use the refs/heads/master branch view and then select the latest "pc" subpath.
 */
export const MCDATA_BASE = 'https://raw.githubusercontent.com/atiweb/minecraft-data/refs/heads/support-1.21.11/data'

// ---------------------------
// Types (lightweight projections)
// ---------------------------
export type McEffect = { id?: number; name?: string; displayName?: string }
export type McEntityRaw = { name?: string; displayName?: string; type?: string }
export type MobEntry = { id: string; label: string; egg: string }

// ---------------------------
// Minimal JSON fetch helper
// ---------------------------
/**
 * Fetch a JSON resource, returning null on network/HTTP failure.
 */
async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { mode: 'cors' })
    if (!res.ok) return null
    return (await res.json()) as T
  } catch {
    return null
  }
}

// ---------------------------
// Latest version discovery (minecraft-data)
// ---------------------------
/**
 * Discover the latest minecraft-data PC version base URL by reading dataPaths.json
 * and choosing the entry that reports proto === 'pc/latest'.
 *
 * The structure of dataPaths.json can be object-shaped for `pc`:
 *   {
 *     pc: {
 *       "1.21.7": { version: "pc/1.21.7", proto: "pc/1.21" },
 *       "1.21.8": { version: "pc/1.21.8", proto: "pc/latest" }
 *     }
 *   }
 *
 * Returns a URL like:
 *   `${MCDATA_BASE}/pc/1.21.8/`
 * or null if it cannot be determined.
 */
async function discoverLatestMinecraftDataVersion(): Promise<string | null> {
  const dp = await fetchJson<any>(`${MCDATA_BASE}/dataPaths.json`)
  if (!dp) return null

  const pc = dp.pc
  // Object-shaped { "1.7": { ... }, "1.21.8": { proto: "pc/latest", version: "pc/1.21.8", ... } }
  if (pc && typeof pc === 'object' && !Array.isArray(pc)) {
    const entries = Object.entries(pc)
    const found = entries.findLast(([, val]) => val && typeof val === 'object' && (val as any).proto === 'pc/latest')
    if (found) {
      const val: any = found[1]
      const verPath: unknown = val.version ?? val.dir ?? val.id
      if (typeof verPath === 'string' && verPath) {
        return verPath.startsWith('pc/') ? `${MCDATA_BASE}/${verPath}/` : `${MCDATA_BASE}/pc/${verPath}/`
      }
    }
  }
  return null
}

// ---------------------------
// Public data API
// ---------------------------
/**
 * McData — tiny facade over PrismarineJS minecraft-data JSON.
 * - getEffects(): string[] of effect display names, sorted.
 * - getMobs(): MobEntry[] filtered to Hostile/Passive mobs, sorted by label.
 *
 * Caching
 * - Results are cached in-memory per session. Concurrent calls coalesce via a loading Promise.
 *
 * Error handling
 * - Network/parse errors resolve to null; callers can present a friendly fallback/notice.
 */
export class McData {
  private static effectsCache: string[] | null = null
  private static effectsLoading: Promise<string[] | null> | null = null

  private static mobsCache: MobEntry[] | null = null
  private static mobsLoading: Promise<MobEntry[] | null> | null = null

  /**
   * Preload both effects and mobs into the in-memory caches.
   * Non-blocking for callers; errors are swallowed.
   */
  static async preloadAll(): Promise<void> {
    try {
      await Promise.allSettled([
        this.getEffects(),
        this.getMobs(),
      ])
    } catch {}
  }

  /**
   * Get effect display names (e.g., "Speed", "Haste") sorted alphabetically.
   */
  static async getEffects(): Promise<string[] | null> {
    if (this.effectsCache) return this.effectsCache
    if (this.effectsLoading) return await this.effectsLoading

    this.effectsLoading = (async () => {
      const base = await discoverLatestMinecraftDataVersion()
      if (!base) return null
      const url = `${base}effects.json`
      const effects = await fetchJson<McEffect[]>(url)
      if (!effects || !Array.isArray(effects)) return null

      const labels = effects
        .map(e => (e.displayName?.trim() || (e.name ? titleFromName(e.name) : '')).trim())
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b))

      this.effectsCache = labels
      return labels
    })()

    const result = await this.effectsLoading
    this.effectsLoading = null
    return result
  }

  /** Entity types that correspond to MyPet-supported mob types */
  private static readonly MOB_TYPES = new Set(['animal', 'hostile', 'mob', 'passive', 'ambient', 'water_creature'])

  /**
   * Get mobs with id, label, and spawn egg id.
   */
  static async getMobs(): Promise<MobEntry[] | null> {
    if (this.mobsCache) return this.mobsCache
    if (this.mobsLoading) return await this.mobsLoading
    console.log('Loading mobs')

    this.mobsLoading = (async () => {
      const base = await discoverLatestMinecraftDataVersion()
      if (!base) console.warn('Failed to discover latest minecraft-data version')

      const url = `${base}entities.json`
      const entities = await fetchJson<McEntityRaw[]>(url)
      if (!entities || !Array.isArray(entities)) return null

      const filtered: MobEntry[] = entities
        .filter(e => e && e.type && this.MOB_TYPES.has(e.type))
        .filter(e => !BLACKLISTED_MOBS.has(e.name || ''))
        .map(e => {
          const name = e.name || ''
          const label = (e.displayName?.trim() || (name ? titleFromName(name) : '')).trim()
          const id = MOB_ID_OVERRIDES[name] ?? toCamelId(name)
          const egg = `${name}_spawn_egg`
          return { id, label, egg }
        })
        .filter(m => m.id && m.label && m.egg)
        .sort((a, b) => a.label.localeCompare(b.label))

      this.mobsCache = filtered
      return filtered
    })()

    const result = await this.mobsLoading
    this.mobsLoading = null
    return result
  }
}
