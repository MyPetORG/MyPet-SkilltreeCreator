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
  Ride.tsx — Skill definition and editor for ride speed/jump modifiers.

  Fields
  - Speed: movement speed modifier (string "+n" or "+n.n").
  - Jump: jump strength modifier (string "+n" or "+n.n").
*/
import React from 'react'
import {z} from 'zod'
import {defineSkill} from './core/contracts'
import type {EditorProps} from './core/contracts'

const schema = z.object({
    Speed: z.string().regex(/^\+?-?\d+(\.\d+)?$/).optional(),
    Jump: z.string().regex(/^\+?-?\d+(\.\d+)?$/).optional(),
})

function RideEditor({value, onChange}: EditorProps) {
    const v = value ?? {}
    return (
        <div style={{display: 'flex', gap: 12}}>
            <label>Speed
                <input
                    value={(v.Speed as string) ?? '+1'}
                    onChange={(e) => onChange({...v, Speed: e.target.value})}
                />
            </label>
            <label>Jump
                <input
                    value={(v.Jump as string) ?? '+1'}
                    onChange={(e) => onChange({...v, Jump: e.target.value})}
                />
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