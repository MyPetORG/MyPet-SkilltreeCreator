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
  Topbar.tsx — Global toolbar with import/export, defaults, and save status.

  - Import: opens a modal to select .st.json files (validated against registry)
  - Load Defaults: replaces current draft with bundled examples
  - Export ZIP: bundles each tree as <ID>.st.json into a single zip download
  - Save button: external handler to persist beyond local autosave
  - Autosave status pill shows current state and last saved time
*/
import React, {useState} from 'react'
import {useStore} from '../../state/store'
import {SKILL_REGISTRY} from '../../skills/core/registry'
import {loadExampleTrees} from '../../lib/codec/json-io'
import JSZip from 'jszip'
import ImportModal from '../modals/ImportModal'
import ThemeToggle from '../common/ThemeToggle'

/** Props for the Topbar component */
 type Props = {
    onSave?: () => void
    onHome?: () => void // Navigate to home (deselect tree)
    rightSlot?: React.ReactNode // e.g., language switch, links
}

/** Topbar — app-level actions and autosave status. */
export default function Topbar({onSave, onHome, rightSlot}: Props) {
    const {trees, setTrees, autosaveStatus, lastSavedAt} = useStore()
    const saveDisabled = autosaveStatus === 'saved'
    const [importOpen, setImportOpen] = useState(false)

    /** Validate a single tree against SKILL_REGISTRY */
    function validateTree(tree: any): boolean {
        if (!tree || !tree.Skills) return false
        for (const skillId of Object.keys(tree.Skills)) {
            if (!SKILL_REGISTRY.get(skillId)) return false
        }
        return true
    }

    /** Replace current workspace with bundled example trees after confirmation. */
    async function onLoadDefaults() {
        if (trees.length > 0) {
            const ok = confirm(
                'This will replace your current skilltrees with the default examples and clear your local draft. Continue?'
            )
            if (!ok) return
        }

        try {
            const examples = await loadExampleTrees()
            setTrees(examples)  // Mark as pending so autosave persists them
        } catch (e) {
            console.error(e)
            alert('Failed to load default examples')
        }
    }

    function onImport() {
        setImportOpen(true)
    }

    function handleImportedTrees(arr: any[]) {
        setTrees(arr)            // keep as 'pending' so autosave runs
        // optional: alert(`Imported ${arr.length} skilltrees`)
    }

    // Handler to export current trees as a ZIP with one file per skilltree
    /** Export current trees to a zip file of <ID>.st.json entries. */
    async function onExport() {
        for (const tree of trees) {
            if (!validateTree(tree)) {
                alert('Export failed: one or more skill trees are invalid')
                return
            }
        }
        if (!trees.length) {
            alert('No skilltrees to export.')
            return
        }

        const zip = new JSZip()
        for (const t of trees) {
            const fileName = `${t.ID}.st.json`
            const json = JSON.stringify(t, null, 2)
            zip.file(fileName, json)
        }

        const blob = await zip.generateAsync({ type: 'blob' })
        const a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        const date = new Date().toISOString().slice(0, 10)
        a.download = `mypet-skilltrees_${date}.zip`
        a.click()
        URL.revokeObjectURL(a.href)
    }

    return (
        <header className="topbar">
            <ImportModal
                isOpen={importOpen}
                onClose={() => setImportOpen(false)}
                onImported={handleImportedTrees}
                validateTree={validateTree}
            />
            <div
                className="topbar__brand"
                onClick={onHome}
                style={{cursor: onHome ? 'pointer' : undefined}}
                title="Go to home"
            >
                <img className="topbar__logo" src="img/logo_16.png" alt="MyPet Logo" style={{imageRendering: 'pixelated'}} draggable={false} />
                <strong>MyPet Skilltree Creator</strong>
            </div>

            <div className="topbar__actions">
                <button onClick={onImport} title="Import .st.json" className="btn">Import</button>
                <button onClick={onLoadDefaults} title="Load default example trees" className="btn">Load Defaults
                </button>
                <button onClick={onExport} title="Export all trees to a zip" className="btn">Export ZIP</button>
                <div className="divider"/>
                <button
                    onClick={onSave}
                    title={saveDisabled ? 'All changes saved' : 'Save changes'}
                    className="btn btn--primary"
                    disabled={saveDisabled}
                >
                    Save
                </button>
            </div>

            <div className="topbar__right" style={{display: 'flex', alignItems: 'center', gap: 12}}>
                <AutosavePill status={autosaveStatus} lastSavedAt={lastSavedAt}/>
                <ThemeToggle />
                {rightSlot}
            </div>
        </header>
    )
}

/** Visual pill showing autosave status and relative time. */
function AutosavePill({status, lastSavedAt}: { status: 'saved' | 'autosaving' | 'pending', lastSavedAt?: number }) {
    let text: string
    if (status === 'autosaving') text = 'Autosaving…'
    else if (status === 'pending') text = 'Unsaved changes'
    else text = lastSavedAt ? `Saved ${timeAgo(lastSavedAt)}` : 'Saved'

    const bg = status === 'pending' ? '#fff2e8' : status === 'autosaving' ? '#eaf2ff' : '#e8fff0'
    const border = status === 'pending' ? '#ffc299' : status === 'autosaving' ? '#cfe0ff' : '#9ddbb1'
    const color = status === 'pending' ? '#8a3b00' : status === 'autosaving' ? '#244a97' : '#145c2a'

    return (
        <span style={{
            padding: '4px 8px',
            borderRadius: 999,
            fontSize: 12,
            background: bg,
            border: `1px solid ${border}`,
            color,
            lineHeight: 1.2,
        }}>
      {text}
    </span>
    )
}

function timeAgo(ts: number) {
    const s = Math.max(0, Math.floor((Date.now() - ts) / 1000))
    if (s < 5) return 'just now'
    if (s < 60) return `${s}s ago`
    const m = Math.floor(s / 60)
    if (m < 60) return `${m}m ago`
    const h = Math.floor(m / 60)
    return `${h}h ago`
}