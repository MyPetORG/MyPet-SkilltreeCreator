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
  SkillEditor.tsx — Editor for a single skill within a skilltree.

  Responsibilities
  - Lists upgrade rows keyed by level specs (e.g., "1", "1,3", "%2>10<50").
  - Validates each upgrade against the skill's zod schema from SKILL_REGISTRY.
  - Supports adding/removing upgrades and editing the level key via LevelModal.
  - For cumulative skills (e.g., Damage, Heal, etc.), enforces that the first
    upgrade defines at least one field.
*/
import React, {useState} from 'react'
import {SKILL_REGISTRY} from '../../skills/core/registry'
import {useStore} from '../../state/store'
import type {SkilltreeFile} from '../../lib/types'
import LevelModal, { LevelSelection } from '../modals/LevelModal'

/** Convert a level key into a human-friendly description used in the UI. */
function humanizeLevel(level: string): string {
    // Fixed numeric level
    if (/^\d+$/.test(level)) return `Level ${level}`
    // Comma-separated fixed list
    if (/^\d+(?:,\d+)+$/.test(level)) return `Level: ${level.split(',').join(', ')}`

    // Pattern: %<every>[>start][<until]
    const m = /^%(\d+)(?:>(\d+))?(?:<(\d+))?$/.exec(level)
    if (!m) return `Level ${level}`

    const every = Number(m[1])
    const start = m[2] != null ? Number(m[2]) : undefined
    const until = m[3] != null ? Number(m[3]) : undefined

    let text = every === 1 ? 'Every level' : `Every ${every} levels`
    if (start != null && until != null) {
        text += ` between levels ${start} and ${until}`
    } else if (start != null) {
        text += ` from level ${start} onward`
    } else if (until != null) {
        text += ` up to level ${until}`
    }
    return text
}

function parseSelection(level: string): LevelSelection | undefined {
    if (/^\d+$/.test(level)) {
        return { type: 'fixed', levels: [Number(level)] }
    }
    // Comma-separated list of fixed levels
    if (/^\d+(?:,\d+)+$/.test(level)) {
        const levels = level.split(',').map(n => Number(n)).filter(n => Number.isFinite(n) && n > 0)
        return { type: 'fixed', levels }
    }
    const m = /^%(\d+)(?:>(\d+))?(?:<(\d+))?$/.exec(level)
    if (m) {
        const every = Number(m[1])
        const start = m[2] != null ? Number(m[2]) : undefined
        const until = m[3] != null ? Number(m[3]) : undefined
        return { type: 'dynamic', every, start, until }
    }
    return undefined
}

export default function SkillEditor({tree, skillId}: { tree: SkilltreeFile, skillId: string }) {
    const upsertTree = useStore(s => s.upsertTree)
    const skillDef = SKILL_REGISTRY.get(skillId)
    const [formOpen, setFormOpen] = useState(false)
    const [editOpen, setEditOpen] = useState(false)
    const [editTarget, setEditTarget] = useState<string | null>(null)

    if (!skillDef) return <p style={{color: 'crimson'}}>Unknown skill: {skillId}</p>

    const upgrades = tree.Skills?.[skillId]?.Upgrades ?? {}

    const addFromSelection = (sel: LevelSelection) => {
        const next = structuredClone(tree)
        if (!next.Skills[skillId]) next.Skills[skillId] = { Upgrades: {} }
        if (sel.type === 'fixed') {
            const uniqSorted = Array.from(new Set(sel.levels.filter(n => Number.isFinite(n) && n > 0).map(n => Math.floor(n)))).sort((a,b)=>a-b)
            if (uniqSorted.length === 0) return
            const key = uniqSorted.join(',')
            next.Skills[skillId].Upgrades[key] = next.Skills[skillId].Upgrades[key] ?? {}
        } else {
            const key = `%${sel.every}` + (sel.start != null ? `>${sel.start}` : '') + (sel.until != null ? `<${sel.until}` : '')
            next.Skills[skillId].Upgrades[key] = next.Skills[skillId].Upgrades[key] ?? {}
        }
        upsertTree(next)
    }

    const updateUpgrade = (level: string, value: Record<string, unknown>) => {
        const next = structuredClone(tree)
        if (!next.Skills[skillId]) next.Skills[skillId] = {Upgrades: {}}
        next.Skills[skillId].Upgrades[level] = value
        upsertTree(next)
    }

    const removeUpgrade = (level: string) => {
        const next = structuredClone(tree)
        delete next.Skills[skillId].Upgrades[level]
        upsertTree(next)
    }

    const editUpgradeKey = (origLevel: string, sel: LevelSelection) => {
        const next = structuredClone(tree)
        const payload = next.Skills[skillId]?.Upgrades?.[origLevel]
        if (!payload) return

        // compute new key
        let newKey: string
        if (sel.type === 'fixed') {
            const uniqSorted = Array.from(new Set(sel.levels.filter(n => Number.isFinite(n) && n > 0).map(n => Math.floor(n)))).sort((a,b)=>a-b)
            if (uniqSorted.length === 0) return
            newKey = uniqSorted.join(',')
        } else {
            newKey = `%${sel.every}` + (sel.start != null ? `>${sel.start}` : '') + (sel.until != null ? `<${sel.until}` : '')
        }

        if (newKey === origLevel) return

        // move payload. Overwrite any existing target key to keep behavior simple
        next.Skills[skillId].Upgrades[newKey] = payload
        delete next.Skills[skillId].Upgrades[origLevel]
        upsertTree(next)
    }

    return (
        <div style={{marginTop: 12, paddingLeft: 8}}>
            <p style={{fontWeight: 500}}>Upgrades:</p>
            {Object.entries(upgrades).length === 0 && <p>No upgrades yet.</p>}

            {Object.entries(upgrades).map(([level, value]) => {
                const parsed = skillDef.schema.safeParse(value)
                let valid = parsed.success
                let errors = !valid
                    ? parsed.error.errors.map((e: { message: any }) => e.message).join(', ')
                    : null

                // Special rule for cumulative skills: only the first upgrade must define at least one field
                const CUMULATIVE_SKILLS = new Set([
                    'Thorns','Wither','Stomp','Slow','Shield','Ride','Arrow','Poison','Pickup','Lightning','Fire','Beacon','Damage','Heal','Knockback','Life','Backpack'
                ])
                if (CUMULATIVE_SKILLS.has(skillDef.id)) {
                    const firstKey = Object.keys(upgrades)[0]
                    const isFirst = firstKey === level
                    if (isFirst) {
                        const v = (value ?? {}) as any
                        // consider any string-typed, non-empty field as provided
                        const hasAny = Object.values(v).some(val => typeof val === 'string' ? val.trim() !== '' : Boolean(val))
                        if (!hasAny) {
                            valid = false
                            errors = 'At least one field must be provided for the first level'
                        }
                    }
                }

                return (
                    <div key={level}
                         className={`upgrade-card ${valid ? '' : 'invalid'}`}
                         style={{
                             border: '2px solid',
                             borderColor: valid ? '#ddd' : '#f88',
                             borderRadius: 8,
                             marginBottom: 8,
                             padding: 8,
                         }}
                         title={errors ?? ''}
                    >
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <strong>{humanizeLevel(level)}</strong>
                            <div style={{display:'flex', gap:6}}>
                                <button className="btn btn--icon" title="Edit upgrade" onClick={() => { setEditTarget(level); setEditOpen(true) }}>✏️</button>
                                <button className="btn btn--icon" title="Remove upgrade" onClick={() => removeUpgrade(level)}>🗑️</button>
                            </div>
                        </div>
                        <skillDef.Editor
                            treeId={tree.ID}
                            skillId={skillId}
                            upgradeKey={level}
                            value={value}
                            onChange={(val: Record<string, unknown>) => updateUpgrade(level, val)}
                        />
                        {!valid && (
                            <p style={{color: '#d33', marginTop: 4, fontSize: 13}}>⚠ {errors}</p>
                        )}
                    </div>
                )
            })}

            <div style={{marginTop: 8}}>
                <button className="btn" onClick={() => setFormOpen(true)}>＋ Add Upgrade</button>
                <LevelModal
                    open={formOpen}
                    onCancel={() => setFormOpen(false)}
                    onSubmit={(sel) => { addFromSelection(sel); setFormOpen(false) }}
                    title="Add Upgrade"
                />
                <LevelModal
                    open={editOpen}
                    onCancel={() => { setEditOpen(false); setEditTarget(null) }}
                    onSubmit={(sel) => { if (editTarget) editUpgradeKey(editTarget, sel); setEditOpen(false); setEditTarget(null) }}
                    initial={editTarget ? parseSelection(editTarget) : undefined}
                    title="Edit Upgrade"
                />
            </div>
        </div>
    )
}