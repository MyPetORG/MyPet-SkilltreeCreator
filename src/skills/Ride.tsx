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
  Ride.tsx — Skill definition and editor for ride speed/jump/fly modifiers.

  Fields
  - Speed: movement speed modifier (string "+n" or "+n.n").
  - JumpHeight: jump strength modifier (string "+n" or "+n.n").
  - CanFly: boolean flag enabling flight capability.
*/
import React from 'react'
import {z} from 'zod'
import {defineSkill} from './core/contracts'
import type {EditorProps} from './core/contracts'

const schema = z.object({
    Speed: z.string().regex(/^\+?-?\d+(\.\d+)?$/).optional(),
    JumpHeight: z.string().regex(/^\+?-?\d+(\.\d+)?$/).optional(),
    CanFly: z.boolean().optional(),
})

function RideEditor({value, onChange}: EditorProps) {
    const v = value ?? {}

    const handleChange = (field: string, val: string | boolean) => {
        const updated = {...v, [field]: val}
        // Remove empty string fields so they don't appear in JSON output
        if (typeof val === 'string' && val === '') {
            delete updated[field]
        }
        // Remove CanFly if unchecked
        if (field === 'CanFly' && val === false) {
            delete updated.CanFly
        }
        onChange(updated)
    }

    return (
        <div style={{display: 'flex', gap: 12, alignItems: 'center'}}>
            <label>Speed
                <input
                    value={(v.Speed as string) ?? ''}
                    onChange={(e) => handleChange('Speed', e.target.value)}
                />
            </label>
            <label>Jump Height
                <input
                    value={(v.JumpHeight as string) ?? ''}
                    onChange={(e) => handleChange('JumpHeight', e.target.value)}
                />
            </label>
            <label>
                <input
                    type="checkbox"
                    checked={!!(v.CanFly as boolean)}
                    onChange={(e) => handleChange('CanFly', e.target.checked)}
                /> Can Fly
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