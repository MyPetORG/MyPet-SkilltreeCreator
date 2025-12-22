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
  Pickup.tsx — Skill definition and editor for pickup range and XP.

  Fields
  - Range: pickup radius in blocks (string "+n").
  - Exp: whether XP orbs are picked up (boolean).
*/
import React from 'react'
import {z} from 'zod'
import {defineSkill} from './core/contracts'
import type {EditorProps} from './core/contracts'
import {normalizeSignedInput, sumUpgradesForFieldWithBreakdown} from './core/utils'
import TotalWithBreakdown from '../components/common/TotalWithBreakdown'

const schema = z.object({
    Range: z.string().regex(/^\+?-?\d+$/).optional(),
    Exp: z.boolean().optional(),
})

function PickupEditor({treeId, skillId, upgradeKey, value, onChange}: EditorProps) {
    const v = (value ?? {}) as any
    const setRange = (raw: string) => {
        onChange({...v, Range: normalizeSignedInput(raw)})
    }

    const rangeData = sumUpgradesForFieldWithBreakdown(treeId, skillId, upgradeKey, 'Range', v?.Range)

    return (
        <div style={{display: 'flex', gap: 12, alignItems: 'center'}}>
            <label>Range (blocks)
                <div style={{display:'flex', alignItems:'center', gap:6}}>
                    <input value={v.Range ?? ''} onChange={e => setRange(e.target.value)}/>
                    <TotalWithBreakdown data={rangeData} />
                </div>
            </label>
            <label>
                <input
                    type="checkbox"
                    checked={!!v.Exp}
                    onChange={e => onChange({...v, Exp: e.target.checked || undefined})}
                /> Pick up XP orbs
            </label>
        </div>
    )
}

export const skillDef = defineSkill({
    id: 'Pickup',
    label: 'Pickup',
    schema,
    Editor: PickupEditor,
})