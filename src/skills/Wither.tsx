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
  Wither.tsx — Skill definition and editor for wither effect application.

  Fields
  - Chance: percent chance to apply wither (string "+n").
  - Duration: wither duration in seconds (string "+n").
*/
import React from 'react'
import {z} from 'zod'
import {defineSkill} from './core/contracts'
import type {EditorProps} from './core/contracts'
import {normalizeSignedInput, sumUpgradesForFieldWithBreakdown} from './core/utils'
import TotalWithBreakdown from '../components/common/TotalWithBreakdown'

const schema = z.object({
    Chance: z.string().regex(/^\+?-?\d+$/).optional(),
    Duration: z.string().regex(/^\+?-?\d+$/).optional(),
})

function WitherEditor({treeId, skillId, upgradeKey, value, onChange}: EditorProps) {
    const v = (value ?? {}) as any

    const chanceData = sumUpgradesForFieldWithBreakdown(treeId, skillId, upgradeKey, 'Chance', v?.Chance)
    const durationData = sumUpgradesForFieldWithBreakdown(treeId, skillId, upgradeKey, 'Duration', v?.Duration)

    return (
        <div style={{display: 'flex', gap: 12}}>
            <label>Chance %
                <div style={{display:'flex', alignItems:'center', gap:6}}>
                    <input value={v.Chance ?? ''} onChange={e => onChange({...v, Chance: normalizeSignedInput(e.target.value)})}/>
                    <TotalWithBreakdown data={chanceData} suffix="%" />
                </div>
            </label>
            <label>Duration (s)
                <div style={{display:'flex', alignItems:'center', gap:6}}>
                    <input value={v.Duration ?? ''} onChange={e => onChange({...v, Duration: normalizeSignedInput(e.target.value)})}/>
                    <TotalWithBreakdown data={durationData} suffix="s" />
                </div>
            </label>
        </div>
    )
}

export const skillDef = defineSkill({
    id: 'Wither',
    label: 'Wither',
    schema,
    Editor: WitherEditor,
})