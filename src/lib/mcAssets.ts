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
// Section A.1 — Minecraft font rendering (browser)
// Uses mcasset.cloud font atlases. Provides a minimal ASCII renderer.
// ============================================================================

/**
 * McStyle — visual style for a text segment when rendering with the Minecraft font.
 */
export type McStyle = {
  color?: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  strike?: boolean
}

/**
 * McSegment — a piece of text with its associated McStyle.
 */
export type McSegment = { text: string; style: McStyle }

// Atlases from mcasset.cloud (latest). We currently only load ascii.png for minimal footprint.
const FONT_ATLAS_URLS = {
  ascii: `${mcAssetsBase()}//assets/minecraft/textures/font/ascii.png`,
  accented: `${mcAssetsBase()}//assets/minecraft/textures/font/accented.png`,
  nonlatin: `${mcAssetsBase()}//assets/minecraft/textures/font/nonlatin_european.png`,
}

// Fixed metrics for the simple renderer — vanilla ASCII sheet is a 16x16 grid of 8px glyphs.
const FONT_TILE = 8
const FONT_GRID = 16

let fontAsciiImage: HTMLImageElement | null = null
let fontLoaded = false

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = (e) => reject(e)
    img.src = url
  })
}

/**
 * initMinecraftFont — lazily loads the ASCII font atlas if not loaded yet.
 * Safe to call multiple times. No-op on server (Image may be undefined).
 */
export async function initMinecraftFont(): Promise<void> {
  if (fontLoaded) return
  fontAsciiImage = await loadImage(FONT_ATLAS_URLS.ascii)
  fontLoaded = true
}

function drawGlyphTinted(
  ctx: CanvasRenderingContext2D,
  atlas: HTMLImageElement,
  sx: number,
  sy: number,
  dx: number,
  dy: number,
  scale: number,
  color: string,
  bold: boolean,
  italic: boolean,
) {
  // Draw glyph to offscreen, then tint with source-in
  const w = FONT_TILE
  const h = FONT_TILE
  const off = document.createElement('canvas')
  off.width = Math.ceil(w * scale) + (bold ? 1 : 0) + (italic ? 1 : 0)
  off.height = Math.ceil(h * scale)
  const octx = off.getContext('2d')!
  // Optional italic skew via transform
  if (italic) {
    octx.setTransform(1, 0, -0.25, 1, 0, 0) // skewX by ~14°
  }
  octx.imageSmoothingEnabled = false
  octx.drawImage(atlas, sx, sy, w, h, 0, 0, w * scale, h * scale)
  if (bold) {
    // Simple bold: draw a 1px offset copy
    octx.drawImage(off, 1, 0)
  }
  octx.globalCompositeOperation = 'source-in'
  octx.fillStyle = color
  octx.fillRect(0, 0, off.width, off.height)

  ctx.imageSmoothingEnabled = false
  ctx.drawImage(off, dx, dy)
}

function glyphPosForCharCode(code: number): { sx: number; sy: number } | null {
  if (code < 0 || code > 255) return null
  const col = code % FONT_GRID
  const row = Math.floor(code / FONT_GRID)
  return { sx: col * FONT_TILE, sy: row * FONT_TILE }
}

/**
 * measureTextWidth — returns the pixel width of the concatenated segments at the given scale.
 * The renderer uses fixed-width advances equal to FONT_TILE * scale.
 */
export function measureTextWidth(segments: McSegment[], scale = 1): number {
  const advance = FONT_TILE * scale
  let width = 0
  for (const seg of segments) {
    width += seg.text.length * advance
  }
  return width
}

/**
 * renderLine — draw Minecraft-styled text into a 2D canvas context at a baseline.
 *
 * Parameters
 * - ctx: Canvas 2D context to draw into
 * - segments: array of McSegment to render sequentially
 * - x: left starting position in CSS pixels
 * - yBaseline: text baseline position (bottom of glyph box)
 * - scale: scale factor (1 => 8px per glyph)
 */
export function renderLine(
  ctx: CanvasRenderingContext2D,
  segments: McSegment[],
  x: number,
  yBaseline: number,
  scale = 1,
): void {
  if (!fontLoaded || !fontAsciiImage) return
  let xCursor = x
  const advance = FONT_TILE * scale
  for (const seg of segments) {
    const color = seg.style.color || '#ffffff'
    const bold = !!seg.style.bold
    const italic = !!seg.style.italic
    const underline = !!seg.style.underline
    const strike = !!seg.style.strike

    for (let i = 0; i < seg.text.length; i++) {
      const ch = seg.text.charCodeAt(i)
      if (ch === 10 /* \n */) { continue }
      if (ch === 13 /* \r */) { continue }
      if (ch === 32 /* space */) { xCursor += advance; continue }
      const pos = glyphPosForCharCode(ch)
      if (pos) {
        drawGlyphTinted(ctx, fontAsciiImage, pos.sx, pos.sy, xCursor, yBaseline - FONT_TILE * scale, scale, color, bold, italic)
      }
      xCursor += advance
    }

    // Decorations for this segment
    const segWidth = seg.text.length * advance
    if (underline) {
      const uy = yBaseline - scale
      ctx.fillStyle = color
      ctx.fillRect(xCursor - segWidth, uy, segWidth, scale)
    }
    if (strike) {
      const sy = yBaseline - Math.round(FONT_TILE * scale * 0.5)
      ctx.fillStyle = color
      ctx.fillRect(xCursor - segWidth, sy, segWidth, scale)
    }
  }
}

// ============================================================================
// Section B — PrismarineJS minecraft-data (JSON)
// ============================================================================

/**
 * Root base for all PrismarineJS minecraft-data JSON fetches.
 * We always use the refs/heads/master branch view and then select the latest "pc" subpath.
 */
export const MCDATA_BASE = 'https://raw.githubusercontent.com/PrismarineJS/minecraft-data/refs/heads/master/data'

// ---------------------------
// Types (lightweight projections)
// ---------------------------
export type McEffect = { id?: number; name?: string; displayName?: string }
export type McEntityRaw = { name?: string; displayName?: string; category?: string }
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
    const found = entries.find(([, val]) => val && typeof val === 'object' && (val as any).proto === 'pc/latest')
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

  /**
   * Get mobs filtered to Hostile and Passive categories with id, label, and spawn egg id.
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
        .filter(e => e && (e.category === 'Hostile mobs' || e.category === 'Passive mobs'))
        .map(e => {
          const name = e.name || ''
          const label = (e.displayName?.trim() || (name ? titleFromName(name) : '')).trim()
          const id = toCamelId(name)
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
