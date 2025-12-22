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
  Lightning.tsx — Skill definition and editor for lightning strike effect.

  Fields
  - Chance: percent chance to strike lightning (string "+n").
  - Damage: additional damage dealt (string "+n" or "+n.n").
*/
import React from 'react'
import {z} from 'zod'
import {defineSkill} from './core/contracts'
import type {EditorProps} from './core/contracts'
import {normalizeSignedInput, sumUpgradesForFieldWithBreakdown, parsePlusFloat} from './core/utils'
import TotalWithBreakdown from '../components/common/TotalWithBreakdown'

const schema = z.object({
    Chance: z.string().regex(/^\+?-?\d+$/).optional(),
    Damage: z.string().regex(/^\+?-?\d+(\.\d+)?$/).optional(),
})

function LightningEditor({treeId, skillId, upgradeKey, value, onChange}: EditorProps) {
    const v = (value ?? {}) as any

    const chanceData = sumUpgradesForFieldWithBreakdown(treeId, skillId, upgradeKey, 'Chance', v?.Chance)
    const damageData = sumUpgradesForFieldWithBreakdown(treeId, skillId, upgradeKey, 'Damage', v?.Damage, parsePlusFloat)

    return (
        <div style={{display: 'flex', gap: 12}}>
            <label>Chance %
                <div style={{display:'flex', alignItems:'center', gap:6}}>
                    <input value={v.Chance ?? ''} onChange={e => onChange({...v, Chance: normalizeSignedInput(e.target.value)})}/>
                    <TotalWithBreakdown data={chanceData} suffix="%" />
                </div>
            </label>
            <label>Extra Damage
                <div style={{display:'flex', alignItems:'center', gap:6}}>
                    <input value={v.Damage ?? ''} onChange={e => onChange({...v, Damage: normalizeSignedInput(e.target.value)})}/>
                    <TotalWithBreakdown data={damageData} />
                </div>
            </label>
        </div>
    )
}

export const skillDef = defineSkill({
    id: 'Lightning',
    label: 'Lightning',
    schema,
    Editor: LightningEditor,
})