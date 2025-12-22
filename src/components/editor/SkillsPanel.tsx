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
  SkillsPanel.tsx — Manage the list of skills within a skilltree.

  Provides adding/removing skills from the registry, highlights validation
  issues, and expands a SkillEditor for the selected skill.
*/
import React, {useMemo, useState} from 'react'
import {useStore} from '../../state/store'
import {SKILL_REGISTRY} from '../../skills/core/registry'
import { useTreeValidation } from '../../lib/validation'
import ValidationIcon from '../common/ValidationIcon'
import type {SkilltreeFile} from '../../lib/types'
import SkillEditor from './SkillEditor'
import DropdownPicker from '../common/DropdownPicker'

/**
 * SkillIcon — shows a tiny PNG icon for a skill id from public/img/skills.
 * Hides itself if the image is missing (onError).
 */
function SkillIcon({id}: { id: string }) {
    const [hidden, setHidden] = React.useState(false)
    if (hidden) return null
    // Map skill id to image file in public/img/skills. Default heuristic: lowercase id.
    const base = id.toLowerCase()
    const src = `img/skills/${base}.png`
    return (
        <img
            src={src}
            alt={`${id} icon`}
            width={18}
            height={18}
            style={{display: 'inline-block', borderRadius: 3, imageRendering: 'pixelated'}}
            onError={() => setHidden(true)}
            draggable={false}
        />
    )
}

// Reusable dropdown picker is now in components/common/DropdownPicker

/**
 * SkillsPanel — lists skills in the current tree, allows adding/removing, and flags validation errors.
 */
export default function SkillsPanel({tree}: { tree: SkilltreeFile }) {
    const upsertTree = useStore(s => s.upsertTree)
    const [selectedSkill, setSelectedSkill] = useState<string | null>(null)
    const existing = Object.keys(tree.Skills || {}).sort()

    // Get validation errors from centralized validation service
    const { skillErrors } = useTreeValidation(tree.ID)

    const availableOptions = useMemo(() => {
        const all = Array.from(SKILL_REGISTRY.keys()).sort()
        return all.filter(name => !existing.includes(name))
    }, [existing])

    const [pending, setPending] = useState<string>(availableOptions[0] ?? '')

    // Keep the pending selection in sync with the available options.
    // If the currently selected value is no longer available (e.g., after adding it),
    // move selection to the first available option (or empty when none).
    React.useEffect(() => {
        if (!pending || !availableOptions.includes(pending)) {
            setPending(availableOptions[0] ?? '')
        }
    }, [availableOptions])

    const addSkill = () => {
        const choice = pending?.trim()
        if (!choice) return
        if (!SKILL_REGISTRY.has(choice)) return alert('Unknown skill: ' + choice)
        if (existing.includes(choice)) return alert('This skill already exists.')
        const next = structuredClone(tree)
        next.Skills[choice] = {Upgrades: {}}
        upsertTree(next)
        setSelectedSkill(choice)
    }

    const removeSkill = (id: string) => {
        if (!confirm(`Remove skill "${id}"?`)) return
        const next = structuredClone(tree)
        delete next.Skills[id]
        upsertTree(next)
        if (selectedSkill === id) setSelectedSkill(null)
    }

    return (
        <section className="card" style={{display: 'grid', gap: 12}}>
            <div className="section-header">
                <h3>Skills</h3>
                <div className="inline" style={{position: 'relative'}}>
                    <DropdownPicker
                        options={availableOptions}
                        value={pending}
                        onChange={setPending}
                        placeholder="(All skills added)"
                        renderOption={(opt) => (<><SkillIcon id={opt as string} /><span>{opt}</span></>)}
                    />
                    <button className="btn" onClick={addSkill} disabled={!pending || availableOptions.length === 0}>
                        ＋ Add Skill
                    </button>
                </div>
            </div>

            {existing.length === 0 && <p>No skills yet.</p>}

            {existing.map((id) => {
                const hasError = skillErrors.has(id)
                const isSelected = selectedSkill === id
                const classes = ['skill-card']
                if (isSelected) classes.push('is-selected')
                if (hasError) classes.push('has-error')
                return (
                    <div
                        key={id}
                        className={classes.join(' ')}
                    >
                        <div className="section-header" style={{marginBottom: 6}}>
                            <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                                <SkillIcon id={id} />
                                <strong style={{cursor: 'pointer'}} onClick={() => setSelectedSkill(prev => prev === id ? null : id)}>{id}</strong>
                                {hasError && <ValidationIcon size={14} title="This skill has validation errors" />}
                            </div>
                            <button className="btn btn--icon" onClick={() => removeSkill(id)}>🗑️</button>
                        </div>

                        {isSelected && (
                            <SkillEditor tree={tree} skillId={id}/>
                        )}
                    </div>
                )
            })}
        </section>
    )
}