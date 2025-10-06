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

import type {z} from 'zod'
import type {ComponentType} from 'react'

export type PlusNumber = string      // "+1.5"
export type Tri = boolean | undefined

/** Props every field editor receives for a single upgrade row */
export interface EditorProps {
    treeId: string
    /** The skill id this editor is rendering for (e.g., "Thorns"). */
    skillId: string
    // upgradeKey is a fixed level ("1", "3") or a dynamic rule ("%1>1<100")
    upgradeKey: string
    // current payload for that upgrade (or undefined if new)
    value: Record<string, unknown> | undefined
    onChange: (next: Record<string, unknown>) => void
}

/** Definition each FieldEditor must export as `skillDef` */
export interface SkillDefinition<Id extends string = string> {
    /** Unique skill id, e.g. "Damage" */
    id: Id
    /** Human label for UI */
    label: string
    /** Zod schema describing this skill's upgrade payload */
    schema: z.ZodTypeAny
    /** React editor component for this skill's upgrade payload */
    Editor: ComponentType<EditorProps>
}

/** Helper to preserve the literal `id` type via const generics (allowed on functions) */
export function defineSkill<const Id extends string>(def: SkillDefinition<Id>) {
    return def
}
