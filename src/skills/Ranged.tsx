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
  Ranged.tsx — Skill definition and editor for ranged projectile attacks.

  Fields
  - Damage: additive damage for projectiles (string "+n" or "+n.n").
  - Rate: attack rate or cooldown (string "+n").
  - Projectile: projectile type (e.g., "Arrow", "Snowball").
*/
import React from 'react'
import {z} from 'zod'
import {defineSkill} from './core/contracts'
import type {EditorProps} from './core/contracts'
import {normalizeSignedInput} from './core/utils'

const schema = z.object({
    Damage: z.string().regex(/^\+?-?\d+(\.\d+)?$/).optional(),
    Rate: z.string().regex(/^\+?-?\d+$/).optional(),
    Projectile: z.string().min(1).optional(), // e.g., "Arrow", "Snowball", "LlamaSpit"
})

const commonProjectiles = ['Arrow', 'Snowball', 'SmallFireball', 'LlamaSpit']

function RangedEditor({value, onChange}: EditorProps) {
    const v = (value ?? {}) as any
    return (
        <div style={{display: 'grid', gap: 12}}>
            <div style={{display: 'flex', gap: 12}}>
                <label>Damage
                    <input value={v.Damage ?? ''} onChange={e => onChange({...v, Damage: normalizeSignedInput(e.target.value)})}/>
                </label>
                <label>Rate (cooldown or speed)
                    <input value={v.Rate ?? ''} onChange={e => onChange({...v, Rate: normalizeSignedInput(e.target.value)})}/>
                </label>
            </div>
            <div>
                <label>Projectile
                    <input
                        list="projectiles"
                        value={v.Projectile ?? ''}
                        onChange={e => onChange({...v, Projectile: e.target.value || undefined})}
                        placeholder="Arrow"
                    />
                </label>
                <datalist id="projectiles">
                    {commonProjectiles.map(p => <option key={p} value={p}/>)}
                </datalist>
            </div>
        </div>
    )
}

export const skillDef = defineSkill({
    id: 'Ranged',
    label: 'Ranged',
    schema,
    Editor: RangedEditor,
})