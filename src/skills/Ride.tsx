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
  Ride.tsx — Skill definition and editor for ride speed/jump/fly modifiers.

  Fields
  - Speed: movement speed modifier (string "+n" or "+n.n").
  - JumpHeight: jump strength modifier (string "+n" or "+n.n").
  - CanFly: boolean flag enabling flight capability.
*/
import React from 'react'
import {z} from 'zod'
import {defineSkill} from './core/contracts'
import type {EditorProps} from './core/contracts'
import {normalizeSignedInput, sumUpgradesForFieldWithBreakdown, parsePlusFloat} from './core/utils'
import TotalWithBreakdown from '../components/common/TotalWithBreakdown'

const schema = z.object({
    Speed: z.string().regex(/^\+?-?\d+(\.\d+)?$/).optional(),
    JumpHeight: z.string().regex(/^\+?-?\d+(\.\d+)?$/).optional(),
    CanFly: z.boolean().optional(),
})

function RideEditor({treeId, skillId, upgradeKey, value, onChange}: EditorProps) {
    const v = (value ?? {}) as any

    const speedData = sumUpgradesForFieldWithBreakdown(treeId, skillId, upgradeKey, 'Speed', v?.Speed, parsePlusFloat)
    const jumpData = sumUpgradesForFieldWithBreakdown(treeId, skillId, upgradeKey, 'JumpHeight', v?.JumpHeight, parsePlusFloat)

    const handleChange = (field: string, val: string | boolean) => {
        const updated = {...v, [field]: field === 'CanFly' ? val : normalizeSignedInput(val as string)}
        // Remove empty/undefined fields so they don't appear in JSON output
        if (updated[field] === undefined || updated[field] === '') {
            delete updated[field]
        }
        // Remove CanFly if unchecked
        if (field === 'CanFly' && val === false) {
            delete updated.CanFly
        }
        onChange(updated)
    }

    return (
        <div style={{display: 'flex', gap: 12, alignItems: 'center'}}>
            <label>Speed
                <div style={{display:'flex', alignItems:'center', gap:6}}>
                    <input
                        value={v.Speed ?? ''}
                        onChange={(e) => handleChange('Speed', e.target.value)}
                    />
                    <TotalWithBreakdown data={speedData} />
                </div>
            </label>
            <label>Jump Height
                <div style={{display:'flex', alignItems:'center', gap:6}}>
                    <input
                        value={v.JumpHeight ?? ''}
                        onChange={(e) => handleChange('JumpHeight', e.target.value)}
                    />
                    <TotalWithBreakdown data={jumpData} />
                </div>
            </label>
            <label>
                <input
                    type="checkbox"
                    checked={!!v.CanFly}
                    onChange={(e) => handleChange('CanFly', e.target.checked)}
                /> Can Fly
            </label>
        </div>
    )
}

export const skillDef = defineSkill({
    id: 'Ride',
    label: 'Ride',
    schema,
    Editor: RideEditor,
})