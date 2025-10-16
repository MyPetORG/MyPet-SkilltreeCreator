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
  mcUtil.ts — Small string/id helpers for Minecraft identifiers and labels.

  These are UI-focused utilities used across the project to normalize and
  transform Minecraft-like identifiers between common formats.
*/

/**
 * Normalize an optional id to include the minecraft: namespace.
 * - Returns null for falsy inputs.
 * - Lowercases the id.
 *
 * Examples:
 *   normId('stone') → 'minecraft:stone'
 *   normId('minecraft:stone') → 'minecraft:stone'
 */
export function normId(id?: string): string | null {
  if (!id) return null
  const s = id.toLowerCase()
  return s.includes(":") ? s : `minecraft:${s}`
}

/**
 * Remove a namespace prefix like "minecraft:" if present.
 *
 * Example: stripNs('minecraft:block/stone') → 'block/stone'
 */
export function stripNs(path: string): string {
  return path.includes(":") ? path.split(":")[1] : path
}

/**
 * Normalize a display label (e.g., "Jump Boost") or id (e.g., "jump_boost")
 * into a snake_case identifier ("jump_boost").
 */
export function toSnakeId(label: string): string {
  return label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
}

/**
 * Convert an id-like name (zombie_piglin) to Title Case ("Zombie Piglin").
 */
export function titleFromName(name: string): string {
  return name
    .split(/[_\-\s]+/g)
    .map(w => (w ? w.charAt(0).toUpperCase() + w.slice(1) : w))
    .join(' ')
}

/**
 * Convert snake_case to CamelCase id ("zombie_piglin" → "ZombiePiglin").
 */
export function toCamelId(snake: string): string {
  return snake
    .split(/[_\-\s]+/g)
    .map(w => (w ? w.charAt(0).toUpperCase() + w.slice(1) : w))
    .join('')
}
