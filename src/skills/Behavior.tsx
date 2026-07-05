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
  Behavior.tsx — Skill definition and editor for behavioral toggles.

  Fields (optional booleans)
  - Friend, Farm, Duel, Aggro, Raid

  UI Notes
  - Presents a simple checklist; undefined fields are omitted from payload.
*/
import React from 'react'
import { useTranslation } from 'react-i18next'
import {z} from 'zod'
import {defineSkill} from './core/contracts'
import type {EditorProps} from './core/contracts'

const schema = z.object({
    Friend: z.boolean().optional(),
    Farm: z.boolean().optional(),
    Duel: z.boolean().optional(),
    Aggro: z.boolean().optional(),
    Raid: z.boolean().optional(),
})

function BehaviorEditor({value, onChange}: EditorProps) {
    const { t } = useTranslation('skills')
    const v = value ?? {}
    const toggle = (k: string) => onChange({...v, [k]: !(v as any)[k]})

    const fields = ['friend', 'farm', 'duel', 'aggro', 'raid'] as const
    const fieldKeys = ['Friend', 'Farm', 'Duel', 'Aggro', 'Raid']

    return (
        <div style={{display: 'flex', flexWrap: 'wrap', gap: 12}}>
            {fields.map((f, i) => (
                <label key={f}>
                    <input
                        type="checkbox"
                        checked={!!(v as any)[fieldKeys[i]]}
                        onChange={() => toggle(fieldKeys[i])}
                    /> {t(`Behavior.fields.${f}`)}
                </label>
            ))}
        </div>
    )
}

export const skillDef = defineSkill({
    id: 'Behavior',
    label: 'Behavior',
    schema,
    Editor: BehaviorEditor,
})