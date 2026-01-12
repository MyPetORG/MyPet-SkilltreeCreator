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

/**
 * Extract the first (lowest) level number from a level key.
 * Used to sort upgrades chronologically by when they first apply.
 *
 * Examples:
 *   "10"        → 10
 *   "1,5,10"    → 1
 *   "%3>2"      → 2  (every 3 levels starting at 2)
 *   "%2"        → 1  (every 2 levels, no start = starts at 1)
 *   "%2<50"     → 1  (every 2 levels until 50, no start = starts at 1)
 */
export function getFirstLevel(level: string): number {
    // Single fixed level
    if (/^\d+$/.test(level)) return Number(level)

    // Comma-separated list — return the minimum
    if (/^\d+(?:,\d+)+$/.test(level)) {
        return Math.min(...level.split(',').map(Number))
    }

    // Dynamic pattern: %<every>[>start][<until]
    const m = /^%(\d+)(?:>(\d+))?(?:<(\d+))?$/.exec(level)
    if (m) {
        // If start is specified, use it; otherwise defaults to 1
        return m[2] != null ? Number(m[2]) : 1
    }

    // Fallback for unknown formats
    return Infinity
}

/**
 * Extract the last (highest) level number from a level key.
 * Used to compute cumulative totals that include all triggers of an upgrade.
 *
 * Examples:
 *   "10"        → 10
 *   "1,5,10"    → 10
 *   "%3>2<74"   → 74  (every 3 levels from 2 until 74)
 *   "%2"        → Infinity  (every 2 levels, unbounded)
 *   "%2>5"      → Infinity  (every 2 levels from 5, unbounded)
 */
export function getLastLevel(level: string): number {
    // Single fixed level
    if (/^\d+$/.test(level)) return Number(level)

    // Comma-separated list — return the maximum
    if (/^\d+(?:,\d+)+$/.test(level)) {
        return Math.max(...level.split(',').map(Number))
    }

    // Dynamic pattern: %<every>[>start][<until]
    const m = /^%(\d+)(?:>(\d+))?(?:<(\d+))?$/.exec(level)
    if (m) {
        // If until is specified, use it; otherwise unbounded
        return m[3] != null ? Number(m[3]) : Infinity
    }

    // Fallback for unknown formats
    return Infinity
}

/**
 * Calculate how many times an upgrade triggers by (and including) a given target level.
 *
 * Examples (targeting level 15):
 *   "10"        → 1  (triggers once at level 10)
 *   "20"        → 0  (hasn't triggered yet)
 *   "1,5,10"    → 3  (all three have triggered)
 *   "%6"        → 3  (triggers at 1, 7, 13 — level 19 hasn't happened yet)
 *   "%6>2"      → 3  (triggers at 2, 8, 14)
 */
export function countTriggersBy(upgradeKey: string, targetLevel: number): number {
    // Single fixed level
    if (/^\d+$/.test(upgradeKey)) {
        return Number(upgradeKey) <= targetLevel ? 1 : 0
    }

    // Comma-separated list — count how many are <= targetLevel
    if (/^\d+(?:,\d+)+$/.test(upgradeKey)) {
        return upgradeKey.split(',').map(Number).filter(lvl => lvl <= targetLevel).length
    }

    // Dynamic pattern: %<every>[>start][<until]
    const m = /^%(\d+)(?:>(\d+))?(?:<(\d+))?$/.exec(upgradeKey)
    if (m) {
        const every = Number(m[1])
        const start = m[2] != null ? Number(m[2]) : 1
        const until = m[3] != null ? Number(m[3]) : Infinity

        if (targetLevel < start) return 0

        // Cap targetLevel at until bound
        const effectiveTarget = Math.min(targetLevel, until)

        // Count: start, start+every, start+2*every, ... up to effectiveTarget
        return Math.floor((effectiveTarget - start) / every) + 1
    }

    return 0
}

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
export interface UpgradeBreakdownItem {
    levelKey: string
    levelLabel: string
    triggerCount: number
    perTrigger: number
    subtotal: number
}

export interface SumWithBreakdown {
    total: number
    breakdown: UpgradeBreakdownItem[]
}

/**
 * Computes the cumulative sum of a numeric field with a breakdown of contributions.
 */
export function sumUpgradesForFieldWithBreakdown(
    treeId: string,
    skillId: string,
    upgradeKey: string,
    field: string,
    currentValue?: string,
    parser: (s?: string) => number = parsePlusInt,
): SumWithBreakdown {
    const state = useStore.getState()
    const tree = state.trees.find(t => t.ID === treeId)
    const upgrades = tree?.Skills?.[skillId]?.Upgrades ?? {}

    // The target level is the last level where the current upgrade applies,
    // so the total includes all triggers of this upgrade
    const targetLevel = getLastLevel(upgradeKey)

    const breakdown: UpgradeBreakdownItem[] = []
    let total = 0

    // Sort entries by first level for consistent breakdown order
    const sortedEntries = Object.entries(upgrades).sort(
        ([a], [b]) => getFirstLevel(a) - getFirstLevel(b)
    )

    for (const [k, val] of sortedEntries) {
        // @ts-ignore index by field name
        const perTrigger = k === upgradeKey ? parser(currentValue) : parser((val as any)?.[field])
        const triggerCount = countTriggersBy(k, targetLevel)
        const subtotal = perTrigger * triggerCount

        if (triggerCount > 0 && perTrigger !== 0) {
            breakdown.push({
                levelKey: k,
                levelLabel: humanizeLevelKey(k),
                triggerCount,
                perTrigger,
                subtotal,
            })
        }

        total += subtotal
    }

    return { total, breakdown }
}

/** Simple text version of level humanization for breakdown tooltips */
function humanizeLevelKey(level: string): string {
    if (/^\d+$/.test(level)) return `Level ${level}`
    if (/^\d+(?:,\d+)+$/.test(level)) return `Levels ${level.split(',').join(', ')}`

    const m = /^%(\d+)(?:>(\d+))?(?:<(\d+))?$/.exec(level)
    if (!m) return `Level ${level}`

    const every = Number(m[1])
    const start = m[2] != null ? Number(m[2]) : 1
    const until = m[3] != null ? Number(m[3]) : undefined

    let text = every === 1 ? 'Every level' : `Every ${every} levels`
    if (until != null) {
        text += ` (${start}-${until})`
    } else if (m[2] != null) {
        text += ` from ${start}`
    }
    return text
}

export function sumUpgradesForField(
    treeId: string,
    skillId: string,
    upgradeKey: string,
    field: string,
    currentValue?: string,
    parser: (s?: string) => number = parsePlusInt,
): number {
    return sumUpgradesForFieldWithBreakdown(treeId, skillId, upgradeKey, field, currentValue, parser).total
}
