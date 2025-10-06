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
  Beacon.tsx — Skill definition and editor for Beacon-like buff area.

  Fields
  - Duration: seconds the buff lasts (string "+n").
  - Range: radius in blocks (string "+n").
  - Count: number of simultaneous buffs allowed (string "+n").
  - Buffs: map of effect name -> true (base level) or "+N" to increase amplifier.

  Data
  - Attempts to fetch latest effect names from minecraft-data via McData; falls
    back to a small default list when offline.
*/
import React, {useEffect, useState} from 'react'
import {z} from 'zod'
import {defineSkill} from './core/contracts'
import type {EditorProps} from './core/contracts'
import DropdownPicker from '../components/common/DropdownPicker'
import { McData } from '../lib/mcAssets'
import { effectIconUrl } from '../lib/mcAssets'

// A small fallback list used if online fetch fails
const DEFAULT_BEACON_EFFECTS = [
    'Speed',
    'Haste',
    'Resistance',
    'Jump Boost',
    'Strength',
    'Regeneration',
]

// Buffs is a map: effectName -> true | "+N"
const beaconSchema = z.object({
    Duration: z.string().regex(/^\+?-?\d+$/).optional(),
    Range: z.string().regex(/^\+?-?\d+$/).optional(),
    Count: z.string().regex(/^\+?-?\d+$/).optional(),
    Buffs: z.record(z.union([z.boolean(), z.string().regex(/^\+?-?\d+$/)])).optional(),
})

function BeaconEffectIcon({effect}: { effect: string }) {
    const [hidden, setHidden] = React.useState(false)
    if (hidden) return null
    const src = effectIconUrl(effect)
    return (
        <img
            src={src}
            alt={`${effect} icon`}
            width={18}
            height={18}
            style={{display: 'inline-block', borderRadius: 3, imageRendering: 'pixelated'}}
            onError={() => setHidden(true)}
            draggable={false}
        />
    )
}


function BeaconEditor({value, onChange}: EditorProps) {
    const v = (value ?? {}) as any
    const buffs: Record<string, boolean | string> = v.Buffs ?? {}
    const [buffKey, setBuffKey] = useState('')
    const [buffVal, setBuffVal] = useState('true') // 'true' | '+1' | '+0'
    const [effects, setEffects] = useState<string[]>(DEFAULT_BEACON_EFFECTS)

    useEffect(() => {
        let cancelled = false
        ;(async () => {
            const list = await McData.getEffects()
            if (!cancelled && list && Array.isArray(list) && list.length) {
                setEffects(list)
            }
        })()
        return () => { cancelled = true }
    }, [])

    const setField = (k: 'Duration' | 'Range' | 'Count', raw: string) => {
        const s = raw.trim()
        const withPlus = s === '' ? undefined : (s.startsWith('+') || s.startsWith('-') ? s : `+${s}`)
        onChange({...v, [k]: withPlus})
    }

    const addBuff = () => {
        const key = buffKey.trim()
        if (!key) return
        const val = buffVal.trim().toLowerCase() === 'true' ? true :
            (buffVal.startsWith('+') || buffVal.startsWith('-') ? buffVal : `+${buffVal}`)
        onChange({...v, Buffs: {...buffs, [key]: val}})
        setBuffKey('')
        setBuffVal('true')
    }

    const removeBuff = (k: string) => {
        const copy = {...buffs}
        delete copy[k]
        onChange({...v, Buffs: Object.keys(copy).length ? copy : undefined})
    }

    const updateBuff = (k: string, val: string) => {
        const parsed = val.trim().toLowerCase() === 'true' ? true :
            (val.startsWith('+') || val.startsWith('-') ? val : `+${val}`)
        onChange({...v, Buffs: {...buffs, [k]: parsed}})
    }

    return (
        <div style={{display: 'grid', gap: 12}}>
            <div style={{display: 'flex', gap: 12}}>
                <label>Duration (s)
                    <input
                        placeholder="+8"
                        value={v.Duration ?? ''}
                        onChange={e => setField('Duration', e.target.value)}
                    />
                </label>
                <label>Range (blocks)
                    <input
                        placeholder="+5"
                        value={v.Range ?? ''}
                        onChange={e => setField('Range', e.target.value)}
                    />
                </label>
                <label>Count (simultaneous buffs)
                    <input
                        placeholder="+1"
                        value={v.Count ?? ''}
                        onChange={e => setField('Count', e.target.value)}
                    />
                </label>
            </div>

            <div>
                <b>Buffs</b>
                <div style={{marginTop: 6}}>
                    {Object.keys(buffs).length === 0 && <div style={{color: '#666'}}>No buffs yet.</div>}
                    {Object.entries(buffs).map(([k, val]) => (
                        <div key={k} style={{display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6}}>
                            <BeaconEffectIcon effect={k} />
                            <code style={{minWidth: 120}}>{k}</code>
                            <input
                                value={typeof val === 'boolean' ? String(val) : String(val)}
                                onChange={e => updateBuff(k, e.target.value)}
                                title={'true to enable base level; or +N to raise amplifier'}
                            />
                            <button className="btn btn--icon" onClick={() => removeBuff(k)}>🗑️</button>
                        </div>
                    ))}
                </div>

                <div style={{display: 'flex', gap: 8, marginTop: 8, alignItems:'center'}}>
                    <DropdownPicker
                        options={effects.filter(e => !(e in buffs))}
                        value={buffKey}
                        onChange={setBuffKey}
                        placeholder="(All effects added)"
                        renderOption={(opt) => (<><BeaconEffectIcon effect={opt as string} /><span>{opt}</span></>)}
                    />
                    <input
                        placeholder="true or +1"
                        value={buffVal}
                        onChange={e => setBuffVal(e.target.value)}
                        style={{width: 120}}
                        title={'true to enable base level; or +N to raise amplifier'}
                    />
                    <button className="btn" onClick={addBuff} disabled={!buffKey}>Add buff</button>
                </div>
            </div>
        </div>
    )
}

export const skillDef = defineSkill({
    id: 'Beacon',
    label: 'Beacon',
    schema: beaconSchema,
    Editor: BeaconEditor,
})