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
import { useTranslation } from 'react-i18next'
import {useStore} from '../../state/store'
import {SKILL_REGISTRY} from '../../skills/core/registry'
import { validateAllTrees, hasErrors } from '../../lib/validation'
import {loadExampleTrees} from '../../lib/codec/json-io'
import JSZip from 'jszip'
import ImportModal from '../modals/ImportModal'
import ThemeToggle from '../common/ThemeToggle'
import { useConfirm } from '../modals/ConfirmModal'
import { useAlert } from '../modals/AlertModal'

/** Props for the Topbar component */
 type Props = {
    onSave?: () => void
    onHome?: () => void // Navigate to home (deselect tree)
    rightSlot?: React.ReactNode // e.g., language switch, links
}

/** Topbar — app-level actions and autosave status. */
export default function Topbar({onSave, onHome, rightSlot}: Props) {
    const { t } = useTranslation()
    const confirm = useConfirm()
    const alert = useAlert()
    const {trees, setTrees, autosaveStatus, lastSavedAt} = useStore()
    const saveDisabled = autosaveStatus === 'saved'
    const [importOpen, setImportOpen] = useState(false)

    /** Basic validation for import: checks if skill IDs exist in registry */
    function validateTreeForImport(tree: any): boolean {
        if (!tree || !tree.Skills) return false
        for (const skillId of Object.keys(tree.Skills)) {
            if (!SKILL_REGISTRY.get(skillId)) return false
        }
        return true
    }

    /** Replace current workspace with bundled example trees after confirmation. */
    async function onLoadDefaults() {
        if (trees.length > 0) {
            const ok = await confirm(t('modals.confirm.loadDefaults'))
            if (!ok) return
        }

        try {
            const examples = await loadExampleTrees()
            setTrees(examples)  // Mark as pending so autosave persists them
        } catch (e) {
            console.error(e)
            await alert(t('modals.alert.loadDefaultsFailed'))
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
        if (!trees.length) {
            await alert(t('modals.alert.noTreesToExport'))
            return
        }

        // Comprehensive validation: schema + business rules
        const validations = validateAllTrees(trees)
        const invalidTrees = validations.filter(v => hasErrors(v))
        if (invalidTrees.length > 0) {
            const names = invalidTrees.map(v => v.treeId).join(', ')
            await alert(t('modals.alert.exportBlocked', { count: invalidTrees.length, names }))
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
                validateTree={validateTreeForImport}
            />
            <div className="topbar__brand-area">
                <div
                    className="topbar__brand"
                    onClick={onHome}
                    style={{cursor: onHome ? 'pointer' : undefined}}
                    title={t('tooltip.goHome')}
                >
                    <img className="topbar__logo" src="img/logo_16.png" alt="MyPet Logo" style={{imageRendering: 'pixelated'}} draggable={false} />
                    <strong>{t('app.title')}</strong>
                </div>
                <span className="version-badge">v{__APP_VERSION__}</span>
            </div>

            <div className="topbar__actions">
                <button onClick={onImport} title={t('tooltip.importFile')} className="btn">{t('actions.import')}</button>
                <button onClick={onLoadDefaults} title={t('tooltip.loadDefaults')} className="btn">{t('actions.loadDefaults')}</button>
                <button onClick={onExport} title={t('tooltip.exportZip')} className="btn">{t('actions.export')}</button>
                <div className="divider"/>
                <button
                    onClick={onSave}
                    title={saveDisabled ? t('tooltip.allChangesSaved') : t('tooltip.saveChanges')}
                    className="btn btn--primary"
                    disabled={saveDisabled}
                >
                    {t('actions.save')}
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
    const { t } = useTranslation()

    let text: string
    if (status === 'autosaving') text = t('autosave.saving')
    else if (status === 'pending') text = t('autosave.pending')
    else text = lastSavedAt ? t('autosave.savedAt', { time: timeAgo(lastSavedAt, t) }) : t('autosave.saved')

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

function timeAgo(ts: number, translate: ReturnType<typeof useTranslation>['t']) {
    const s = Math.max(0, Math.floor((Date.now() - ts) / 1000))
    if (s < 5) return translate('autosave.justNow')
    if (s < 60) return translate('autosave.secondsAgo', { s })
    const m = Math.floor(s / 60)
    if (m < 60) return translate('autosave.minutesAgo', { m })
    const h = Math.floor(m / 60)
    return translate('autosave.hoursAgo', { h })
}