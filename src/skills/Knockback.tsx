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
  Knockback.tsx — Skill definition and editor for knockback chance.

  Field
  - Chance: percent chance to apply knockback (string "+n").
*/
import React from 'react'
import { useTranslation } from 'react-i18next'
import {z} from 'zod'
import {defineSkill} from './core/contracts'
import type {EditorProps} from './core/contracts'
import {normalizeSignedInput, sumUpgradesForFieldWithBreakdown} from './core/utils'
import TotalWithBreakdown from '../components/common/TotalWithBreakdown'

const schema = z.object({
    Chance: z.string().regex(/^\+?-?\d+$/).optional().describe('% chance of knockback'),
})

function KnockbackEditor({treeId, skillId, upgradeKey, value, onChange}: EditorProps) {
    const { t } = useTranslation('skills')
    const chance = (value?.Chance as string) ?? ''

    const chanceData = sumUpgradesForFieldWithBreakdown(treeId, skillId, upgradeKey, 'Chance', (value as any)?.Chance as string | undefined)

    return (
        <label>{t('Knockback.fields.chance')}
            <div style={{display:'flex', alignItems:'center', gap:6}}>
                <input
                    value={chance}
                    onChange={(e) => {
                        onChange({...(value ?? {}), Chance: normalizeSignedInput(e.target.value)})
                    }}
                />
                <TotalWithBreakdown data={chanceData} suffix="%" />
            </div>
        </label>
    )
}

export const skillDef = defineSkill({
    id: 'Knockback',
    label: 'Knockback',
    schema,
    Editor: KnockbackEditor,
})