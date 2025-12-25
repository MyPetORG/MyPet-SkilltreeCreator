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
  Backpack.tsx — Skill definition and editor for the Backpack feature.

  Effect
  - rows: adds rows to the pet's backpack (stored as signed string: "+n").
  - drop: when true, items are dropped on death instead of kept.

  UI Notes
  - Inputs are stored in MyPet-compatible signed string format (e.g., "+1").
  - A running Total is shown by summing previous upgrades for context.
*/
import React from 'react'
import { useTranslation } from 'react-i18next'
import {z} from 'zod'
import {defineSkill} from './core/contracts'
import type {EditorProps} from './core/contracts'
import {normalizeSignedInput, sumUpgradesForFieldWithBreakdown} from './core/utils'
import TotalWithBreakdown from '../components/common/TotalWithBreakdown'

const schema = z.object({
    rows: z.string().regex(/^\+?-?\d+$/).optional().describe('Rows added'),
    drop: z.boolean().optional().describe('Drop items on death'),
})

function BackpackEditor({treeId, skillId, upgradeKey, value, onChange}: EditorProps) {
    const { t } = useTranslation('skills')
    const rows = (value?.rows as string) ?? ''
    const drop = (value?.drop as boolean) ?? false

    const rowsData = sumUpgradesForFieldWithBreakdown(treeId, skillId, upgradeKey, 'rows', (value as any)?.rows as string | undefined)

    return (
        <div style={{display: 'flex', gap: 12, alignItems: 'center'}}>
            <label>{t('Backpack.fields.rows')}
                <div style={{display:'flex', alignItems:'center', gap:6}}>
                    <input
                        value={rows}
                        onChange={(e) =>
                            onChange({...(value ?? {}), rows: normalizeSignedInput(e.target.value)})
                        }
                    />
                    <TotalWithBreakdown data={rowsData} />
                </div>
            </label>
            <label>
                <input
                    type="checkbox"
                    checked={drop}
                    onChange={(e) =>
                        onChange({...(value ?? {}), drop: e.target.checked})
                    }
                /> {t('Backpack.fields.drop')}
            </label>
        </div>
    )
}

export const skillDef = defineSkill({
    id: 'Backpack',
    label: 'Backpack',
    schema,
    Editor: BackpackEditor,
})