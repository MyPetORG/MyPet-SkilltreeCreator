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
  Shield.tsx — Skill definition and editor for Shield.

  Effect
  - Chance: chance in percent to redirect damage to the owner (string "+n").
  - Redirect: percent of incoming damage redirected to owner (string "+n").

  Notes
  - Editor stores numeric inputs as MyPet-compatible "+n" strings; empty input
    clears the field from the payload.
*/
import React from 'react'
import { useTranslation } from 'react-i18next'
import {z} from 'zod'
import {defineSkill} from './core/contracts'
import type {EditorProps} from './core/contracts'
import {normalizeSignedInput, sumUpgradesForFieldWithBreakdown} from './core/utils'
import TotalWithBreakdown from '../components/common/TotalWithBreakdown'

const schema = z.object({
    Chance: z.string().regex(/^\+?-?\d+$/).optional(),
    Redirect: z.string().regex(/^\+?-?\d+$/).optional(), // percent redirected
})

function ShieldEditor({treeId, skillId, upgradeKey, value, onChange}: EditorProps) {
    const { t } = useTranslation('skills')
    const v = (value ?? {}) as any

    const chanceData = sumUpgradesForFieldWithBreakdown(treeId, skillId, upgradeKey, 'Chance', v?.Chance)
    const redirectData = sumUpgradesForFieldWithBreakdown(treeId, skillId, upgradeKey, 'Redirect', v?.Redirect)

    return (
        <div style={{display: 'flex', gap: 12}}>
            <label>{t('Shield.fields.chance')}
                <div style={{display:'flex', alignItems:'center', gap:6}}>
                    <input value={v.Chance ?? ''} onChange={e => onChange({...v, Chance: normalizeSignedInput(e.target.value)})}/>
                    <TotalWithBreakdown data={chanceData} suffix="%" />
                </div>
            </label>
            <label>{t('Shield.fields.redirect')}
                <div style={{display:'flex', alignItems:'center', gap:6}}>
                    <input value={v.Redirect ?? ''} onChange={e => onChange({...v, Redirect: normalizeSignedInput(e.target.value)})}/>
                    <TotalWithBreakdown data={redirectData} suffix="%" />
                </div>
            </label>
        </div>
    )
}

export const skillDef = defineSkill({
    id: 'Shield',
    label: 'Shield',
    schema,
    Editor: ShieldEditor,
})