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
  Sprint.tsx — Skill definition and editor for Sprint toggle.

  Fields
  - Active: boolean toggle to enable sprinting effect.
*/
import React from 'react'
import { useTranslation } from 'react-i18next'
import {z} from 'zod'
import {defineSkill} from './core/contracts'
import type {EditorProps} from './core/contracts'

const schema = z.object({
    Active: z.boolean(),
})

function SprintEditor({value, onChange}: EditorProps) {
    const { t } = useTranslation('skills')
    const active = !!(value as any)?.Active
    return (
        <label>
            <input
                type="checkbox"
                checked={active}
                onChange={e => onChange({Active: e.target.checked})}
            /> {t('Sprint.fields.active')}
        </label>
    )
}

export const skillDef = defineSkill({
    id: 'Sprint',
    label: 'Sprint',
    schema,
    Editor: SprintEditor,
})