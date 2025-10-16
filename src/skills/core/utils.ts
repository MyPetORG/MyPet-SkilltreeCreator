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

import {useStore} from '../../state/store'

/** Normalize user text input to a signed string like "+3" or "-2". Returns undefined for empty. */
export function normalizeSignedInput(raw: string): string | undefined {
    const s = raw.trim()
    if (s === '') return undefined
    return (s.startsWith('+') || s.startsWith('-')) ? s : `+${s}`
}

/** Parse a signed integer stored as string like "+3" or "-2". Undefined/invalid -> 0. */
export function parsePlusInt(s?: string): number {
    if (!s) return 0
    const n = parseInt(String(s).replace('+', ''), 10)
    return Number.isFinite(n) ? n : 0
}

/** Parse a signed float stored as string like "+1.5" or "-0.25". Undefined/invalid -> 0. */
export function parsePlusFloat(s?: string): number {
    if (!s) return 0
    const n = parseFloat(String(s).replace('+', ''))
    return Number.isFinite(n) ? n : 0
}

/**
 * Computes the cumulative sum of a numeric field across upgrades up to and including the current one.
 * - treeId/skillId/upgradeKey identify the specific upgrade row.
 * - field is the property name inside the upgrade object (e.g., "rows", "Range", "Chance").
 * - currentValue is the value that is currently being edited for the row (uncommitted yet).
 * - parser optional custom parser (defaults to parsePlusInt).
 */
export function sumUpgradesForField(
    treeId: string,
    skillId: string,
    upgradeKey: string,
    field: string,
    currentValue?: string,
    parser: (s?: string) => number = parsePlusInt,
): number {
    const state = useStore.getState()
    const tree = state.trees.find(t => t.ID === treeId)
    const upgrades = tree?.Skills?.[skillId]?.Upgrades ?? {}
    let sum = 0
    for (const [k, val] of Object.entries(upgrades)) {
        if (k === upgradeKey) {
            sum += parser(currentValue)
            break
        }
        // @ts-ignore index by field name
        sum += parser((val as any)?.[field])
    }
    return sum
}
