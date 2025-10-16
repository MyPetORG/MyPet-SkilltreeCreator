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
  Poison.tsx — Skill definition and editor for poison effect.

  Fields
  - Chance: percent chance to apply poison (string "+n").
  - Duration: poison duration in seconds (string "+n").
*/
import React from 'react'
import {z} from 'zod'
import {defineSkill} from './core/contracts'
import type {EditorProps} from './core/contracts'
import {normalizeSignedInput} from './core/utils'

const schema = z.object({
    Chance: z.string().regex(/^\+?-?\d+$/).optional(),
    Duration: z.string().regex(/^\+?-?\d+$/).optional(),
})

function PoisonEditor({value, onChange}: EditorProps) {
    const v = value ?? {}
    return (
        <div style={{display: 'flex', gap: 12}}>
            <label>Chance %
                <input value={(v as any).Chance ?? ''} onChange={e => onChange({...v, Chance: normalizeSignedInput(e.target.value)})}/>
            </label>
            <label>Duration (s)
                <input value={(v as any).Duration ?? ''} onChange={e => onChange({...v, Duration: normalizeSignedInput(e.target.value)})}/>
            </label>
        </div>
    )
}

export const skillDef = defineSkill({
    id: 'Poison',
    label: 'Poison',
    schema,
    Editor: PoisonEditor,
})