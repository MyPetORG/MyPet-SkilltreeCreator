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
  Life.tsx — Skill definition and editor for maximum health bonus.

  Field
  - Health: bonus maximum health (e.g., "+1", "+1.5").

  UI Notes
  - Input stored as signed string, with cumulative Total shown across upgrades.
*/
import React from 'react'
import {z} from 'zod'
import {defineSkill} from './core/contracts'
import type {EditorProps} from './core/contracts'
import {normalizeSignedInput, parsePlusFloat, sumUpgradesForFieldWithBreakdown} from './core/utils'
import TotalWithBreakdown from '../components/common/TotalWithBreakdown'

const schema = z.object({
    Health: z.string().regex(/^\+?-?\d+(\.\d+)?$/).optional().describe('Health bonus per upgrade'),
})

function LifeEditor({treeId, skillId, upgradeKey, value, onChange}: EditorProps) {
    const hp = (value?.Health as string) ?? ''

    const healthData = sumUpgradesForFieldWithBreakdown(treeId, skillId, upgradeKey, 'Health', (value as any)?.Health as string | undefined, parsePlusFloat)

    return (
        <label>Health Bonus
            <div style={{display:'flex', alignItems:'center', gap:6}}>
                <input
                    value={hp}
                    onChange={(e) =>
                        onChange({...(value ?? {}), Health: normalizeSignedInput(e.target.value)})
                    }
                />
                <TotalWithBreakdown data={healthData} />
            </div>
        </label>
    )
}

export const skillDef = defineSkill({
    id: 'Life',
    label: 'Life',
    schema,
    Editor: LifeEditor,
})