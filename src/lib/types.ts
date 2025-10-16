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
  Shared domain types used across the Skilltree Creator UI.

  Notes
  - PlusNumber is a string representation that can include a leading plus sign
    and decimals (e.g., "+1", "+1.5").
  - Tri is a tri-state boolean used by some editors: true, false, or undefined
    (meaning "not set").
*/

/** String representation of a number that may include a leading '+' sign. */
export type PlusNumber = string
/** Tri-state boolean where undefined means "unset". */
export type Tri = boolean | undefined

export type UpgradePayload = Record<string, unknown>
export type Upgrades = Record<string, UpgradePayload>
export type Skills = Record<string, { Upgrades: Upgrades }>

/**
 * SkilltreeFile — the canonical JSON structure for a MyPet Skilltree.
 * This interface mirrors the .st.json files that are exported and imported.
 */
export interface SkilltreeFile {
    /** Unique identifier for the skilltree (also file name during export). */
    ID: string
    /** Human-readable name shown in the UI. */
    Name: string
    /** Ordering index for how the skilltree is presented in-game. */
    Order: number
    /** Icon configuration for inventory display. */
    Icon: { Material: string; Glowing?: boolean }
    /** Multi-line description; each line typically begins with a dash in-game. */
    Description: string[]
    /** List of eligible mob type ids (or ['*'] to include all, including future updates). */
    MobTypes: string[]
    /** Optional balancing weight for tree selection. */
    Weight?: number
    /** Minimum player level required to use this tree. */
    RequiredLevel?: number
    /** Maximum level attainable within this tree. */
    MaxLevel?: number
    /** Inheritance configuration to inherit another tree's skills. */
    Inheritance?: { Skilltree: string }
    /** Additional requirement ids that must be satisfied. */
    Requirements?: string[]
    /** Notifications keyed by level spec (e.g., "1", "1,3", or "%1>1<100"). */
    Notifications?: Record<string, string>
    /** Mapping of skill id to its upgrades payloads by level. */
    Skills: Skills
}