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
  AppearanceEditor.tsx — Edit basic visual attributes for the selected skilltree.

  Provides inputs for:
  - Name (tree label)
  - Icon Material and Glowing toggle
  - Multi-line Description with live Minecraft-styled preview

  The editor writes changes back to global state via upsertTree, which triggers
  autosave. Local component state is used to reduce churn while typing.
*/
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {useStore} from '../../state/store'
import type {SkilltreeFile} from '../../lib/types'
import ViewJsonModal from '../modals/ViewJsonModal'
import RichTextPreviewEditor from '../common/RichTextPreviewEditor'

/**
 * Remove an optional leading dash and following space from a description line.
 * Example: "- Speed up" → "Speed up".
 */
function stripLeadingDash(line: string): string {
    return line.replace(/^\s*-\s?/, '')
}

/**
 * Add a leading dash to a description line if it is non-empty, trimming trailing spaces.
 * Empty or whitespace-only lines remain empty.
 */
function addLeadingDash(line: string): string {
  const trimmed = line.trimEnd()
  if (!trimmed) return ''
  return `- ${trimmed}`
}

/**
 * Shallow equality for string arrays.
 * Fast-paths reference equality and length mismatch before iterating.
 */
function arraysEqual(a: string[], b: string[]): boolean {
  if (a === b) return true
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false
  }
  return true
}

/**
 * DescriptionEditor — textarea and canvas preview for the tree's Description field.
 *
 * Props
 * - tree: current skilltree object being edited
 * - apply: helper that clones, mutates, and upserts a new tree (triggers autosave)
 */
function DescriptionEditor({ tree, apply }: { tree: SkilltreeFile; apply: (mutate: (t: SkilltreeFile) => void) => void }) {
    const { t } = useTranslation()
    const initial = useMemo(() => (tree.Description ?? []).map(stripLeadingDash).join('\n'), [tree.Description])
    const [descText, setDescText] = useState<string>(initial)
    const descTextRef = useRef<string>(initial)

    // Keep local text in sync when tree changes
    useEffect(() => {
        const next = (tree.Description ?? []).map(stripLeadingDash).join('\n')
        setDescText(next)
        descTextRef.current = next
    }, [tree.ID, tree.Description])

    const handleSave = () => {
        const lines = descText.split('\n').map(l => addLeadingDash(l)).filter(l => l !== '').map(l => l.trim())
        const current = (tree.Description ?? []).map(l => l.trim())
        if (arraysEqual(lines, current)) return
        apply(tr => { tr.Description = lines })
    }

    return (
        <RichTextPreviewEditor
            label={t('appearance.description')}
            value={descText}
            onChange={(v) => {
                setDescText(v)
                descTextRef.current = v
                const lines = v.split('\n').map(l => addLeadingDash(l)).filter(l => l !== '')
                apply(tr => { tr.Description = lines })
            }}
            onBlur={handleSave}
            rows={Math.max(1, (descText.match(/\n/g)?.length ?? 0) + 1)}
            maxWidth={520}
        />
    )
}

/**
 * AppearanceEditor — main panel to edit the selected skilltree's name, icon, and description.
 * Reads and writes to global Zustand store, debounced by autosave.
 */
export default function AppearanceEditor() {
    const { t } = useTranslation()
    const trees = useStore(s => s.trees)
    const selectedId = useStore(s => s.selectedId)
    const upsertTree = useStore(s => s.upsertTree)

    const tree = trees.find(tr => tr.ID === selectedId)
    if (!tree) return <p>{t('home.description')}</p>

    // helper to clone → mutate → upsert (triggers autosave)
    const apply = (mutate: (t: SkilltreeFile) => void) => {
        const next: SkilltreeFile = JSON.parse(JSON.stringify(tree))
        mutate(next)
        next.ID = next.ID.trim()
        next.Name = next.Name.trim()
        next.Description = (next.Description ?? []).map(l => l.trim())
        if (!next.MobTypes.length) next.MobTypes = ['*']
        upsertTree(next)
    }

    // Local state for Icon Material to avoid spamming lookups while typing
    const [materialInput, setMaterialInput] = useState(tree.Icon?.Material ?? '')

    // Keep local state in sync when the selected tree or its icon changes
    useEffect(() => {
        setMaterialInput(tree.Icon?.Material ?? '')
    }, [tree.ID, tree.Icon?.Material])

    // JSON modal state
    const [jsonOpen, setJsonOpen] = useState(false)

    return (
        <section className="card">
            <div className="section-header">
                <h3>{t('tabs.appearance')}</h3>
                <button className="btn" onClick={() => setJsonOpen(true)}>{t('appearance.viewJson')}</button>
            </div>

            <div className="form-grid">
                <div className="field">
                    <label className="label">{t('appearance.name')}</label>
                    <input
                        className="input"
                        value={tree.Name}
                        onChange={(e) => apply(tr => {
                            tr.Name = e.target.value
                        })}
                        placeholder={t('appearance.namePlaceholder')}
                    />
                </div>



                <div className="field">
                    <label className="label">{t('appearance.iconMaterial')}</label>
                    <div className="inline">
                        <input
                            className="input"
                            value={materialInput}
                            onChange={(e) => setMaterialInput(e.target.value)}
                            onBlur={() => {
                                const next = materialInput.trim()
                                const curr = (tree.Icon?.Material ?? '').trim()
                                if (next === curr) return
                                apply(tr => {
                                    const base = tr.Icon ?? { Material: '' }
                                    tr.Icon = { ...base, Material: next }
                                })
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.currentTarget.blur();
                                }
                            }}
                            placeholder={t('appearance.iconMaterialPlaceholder')}
                        />
                        <label className="checkbox">
                            <input
                                type="checkbox"
                                checked={!!tree.Icon?.Glowing}
                                onChange={(e) => apply(tr => {
                                    tr.Icon = {...(tr.Icon ?? {Material: ''}), Glowing: e.target.checked || undefined}
                                })}
                            />
                            {t('appearance.glowing')}
                        </label>
                    </div>
                </div>

                <DescriptionEditor tree={tree} apply={apply} />
            </div>
            <ViewJsonModal isOpen={jsonOpen} onClose={() => setJsonOpen(false)} tree={tree} />
        </section>
    )
}
