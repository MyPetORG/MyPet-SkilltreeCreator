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
  Damage.tsx — Skill definition and editor for flat damage bonus.

  Field
  - Damage: signed amount applied additively (e.g., "+1", "+1.5").

  UI Notes
  - Stores numeric input as MyPet-compatible "+n" strings.
  - Shows running Total by summing earlier upgrades using parsePlusFloat.
*/
import React from 'react'
import {z} from 'zod'
import type {EditorProps} from './core/contracts'
import {defineSkill} from './core/contracts'
import {normalizeSignedInput, parsePlusFloat, sumUpgradesForField} from './core/utils'

const damageSchema = z.object({
    Damage: z.string().regex(/^\+?-?\d+(\.\d+)?$/).optional(), // "+1.5", "+2", "-0.5" (if ever needed)
})

function DamageEditor({treeId, skillId, upgradeKey, value, onChange}: EditorProps) {
    const amount = (value?.Damage as string) ?? ''

    const sum = sumUpgradesForField(treeId, skillId, upgradeKey, 'Damage', (value as any)?.Damage as string | undefined, parsePlusFloat)

    return (
        <label>
            Damage (+X)
            <div style={{display:'flex', alignItems:'center', gap:6}}>
                <input
                    value={amount}
                    onChange={(e) => {
                        onChange({...(value ?? {}), Damage: normalizeSignedInput(e.target.value)})
                    }}
                />
                <span style={{fontSize:12, color:'#666'}}>(Total: {sum >= 0 ? '+' : ''}{sum})</span>
            </div>
        </label>
    )
}

export const skillDef = defineSkill({
    id: 'Damage',
    label: 'Damage',
    schema: damageSchema,
    Editor: DamageEditor,
})