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
  Bleed.tsx — Skill definition and editor for bleed damage-over-time effect.

  Fields
  - Damage: damage dealt per tick (string "+n" or "+n.n").
  - Interval: seconds between damage applications (string "+n", cumulative).
  - Duration: total bleed duration in seconds (string "+n").
  - Chance: percent chance to apply bleed (string "+n").
*/
import React from 'react'
import { useTranslation } from 'react-i18next'
import {z} from 'zod'
import {defineSkill} from './core/contracts'
import type {EditorProps} from './core/contracts'
import {normalizeSignedInput, sumUpgradesForFieldWithBreakdown, parsePlusFloat} from './core/utils'
import TotalWithBreakdown from '../components/common/TotalWithBreakdown'

const schema = z.object({
    Damage: z.string().regex(/^\+?-?\d+(\.\d+)?$/).optional(),
    Interval: z.string().regex(/^\+?-?\d+$/).optional(),
    Duration: z.string().regex(/^\+?-?\d+$/).optional(),
    Chance: z.string().regex(/^\+?-?\d+$/).optional(),
})

function BleedEditor({treeId, skillId, upgradeKey, value, onChange}: EditorProps) {
    const { t } = useTranslation('skills')
    const v = (value ?? {}) as any

    const damageData = sumUpgradesForFieldWithBreakdown(treeId, skillId, upgradeKey, 'Damage', v?.Damage, parsePlusFloat)
    const intervalData = sumUpgradesForFieldWithBreakdown(treeId, skillId, upgradeKey, 'Interval', v?.Interval)
    const durationData = sumUpgradesForFieldWithBreakdown(treeId, skillId, upgradeKey, 'Duration', v?.Duration)
    const chanceData = sumUpgradesForFieldWithBreakdown(treeId, skillId, upgradeKey, 'Chance', v?.Chance)

    return (
        <div style={{display: 'flex', gap: 12, flexWrap: 'wrap'}}>
            <label>{t('Bleed.fields.damage')}
                <div style={{display:'flex', alignItems:'center', gap:6}}>
                    <input value={v.Damage ?? ''} onChange={e => onChange({...v, Damage: normalizeSignedInput(e.target.value)})}/>
                    <TotalWithBreakdown data={damageData} />
                </div>
            </label>
            <label>{t('Bleed.fields.interval')}
                <div style={{display:'flex', alignItems:'center', gap:6}}>
                    <input value={v.Interval ?? ''} onChange={e => onChange({...v, Interval: normalizeSignedInput(e.target.value)})}/>
                    <TotalWithBreakdown data={intervalData} suffix="s" />
                </div>
            </label>
            <label>{t('Bleed.fields.duration')}
                <div style={{display:'flex', alignItems:'center', gap:6}}>
                    <input value={v.Duration ?? ''} onChange={e => onChange({...v, Duration: normalizeSignedInput(e.target.value)})}/>
                    <TotalWithBreakdown data={durationData} suffix="s" />
                </div>
            </label>
            <label>{t('Bleed.fields.chance')}
                <div style={{display:'flex', alignItems:'center', gap:6}}>
                    <input value={v.Chance ?? ''} onChange={e => onChange({...v, Chance: normalizeSignedInput(e.target.value)})}/>
                    <TotalWithBreakdown data={chanceData} suffix="%" />
                </div>
            </label>
        </div>
    )
}

export const skillDef = defineSkill({
    id: 'Bleed',
    label: 'Bleed',
    schema,
    Editor: BleedEditor,
})