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
  - Damage: percent of incoming damage redirected to owner (string "+n").

  Notes
  - Editor stores numeric inputs as MyPet-compatible "+n" strings; empty input
    clears the field from the payload.
*/
import React from 'react'
import {z} from 'zod'
import {defineSkill} from './core/contracts'
import type {EditorProps} from './core/contracts'

// "Damage" is used by MyPet as the percent of redirected damage.
// If your JSONs use a different key (e.g., "Percent"), adjust here.
const schema = z.object({
    Chance: z.string().regex(/^\+?-?\d+$/).optional(),
    Damage: z.string().regex(/^\+?-?\d+$/).optional(), // percent redirected
})

function ShieldEditor({value, onChange}: EditorProps) {
    const v = (value ?? {}) as any
    const set = (k: 'Chance' | 'Damage', raw: string) => {
        const s = raw.trim()
        const withPlus = s === '' ? undefined : (s.startsWith('+') || s.startsWith('-') ? s : `+${s}`)
        onChange({...v, [k]: withPlus})
    }
    return (
        <div style={{display: 'flex', gap: 12}}>
            <label>Chance %
                <input value={v.Chance ?? ''} onChange={e => set('Chance', e.target.value)}/>
            </label>
            <label>Redirect % (Damage)
                <input value={v.Damage ?? ''} onChange={e => set('Damage', e.target.value)}/>
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