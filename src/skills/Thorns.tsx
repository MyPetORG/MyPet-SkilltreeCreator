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
  Thorns.tsx — Skill definition and editor for damage reflection (thorns).

  Fields
  - Reflection: percent of incoming damage reflected (string "+n").
  - Chance: percent chance to trigger reflection (string "+n").
*/
import React from 'react'
import {z} from 'zod'
import {defineSkill} from './core/contracts'
import type {EditorProps} from './core/contracts'
import {normalizeSignedInput, sumUpgradesForField} from './core/utils'

const schema = z.object({
    Reflection: z.string().regex(/^\+?-?\d+$/).optional().describe('% of damage reflected'),
    Chance: z.string().regex(/^\+?-?\d+$/).optional().describe('% chance to trigger'),
})

function ThornsEditor({treeId, skillId, upgradeKey, value, onChange}: EditorProps) {
    const v = (value ?? {}) as any

    const sumRefl = sumUpgradesForField(treeId, skillId, upgradeKey, 'Reflection', v?.Reflection)
    const sumChance = sumUpgradesForField(treeId, skillId, upgradeKey, 'Chance', v?.Chance)

    return (
        <div style={{display: 'flex', gap: 12}}>
            <label>Reflection %
                <div style={{display:'flex', alignItems:'center', gap:6}}>
                    <input value={v.Reflection ?? ''} onChange={e => onChange({...v, Reflection: normalizeSignedInput(e.target.value)})} />
                    <span style={{fontSize:12, color:'#666'}}>(Total: {sumRefl >= 0 ? '+' : ''}{sumRefl}%)</span>
                </div>
            </label>
            <label>Chance %
                <div style={{display:'flex', alignItems:'center', gap:6}}>
                    <input value={v.Chance ?? ''} onChange={e => onChange({...v, Chance: normalizeSignedInput(e.target.value)})} />
                    <span style={{fontSize:12, color:'#666'}}>(Total: {sumChance >= 0 ? '+' : ''}{sumChance}%)</span>
                </div>
            </label>
        </div>
    )
}

export const skillDef = defineSkill({
    id: 'Thorns',
    label: 'Thorns',
    schema,
    Editor: ThornsEditor,
})