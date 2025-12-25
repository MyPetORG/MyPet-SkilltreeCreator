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
  App.tsx — Root application layout and orchestration.

  Responsibilities
  - Bootstraps state by restoring a local draft (if present) or starting with a blank slate.
  - Wires up autosave and beforeunload warning lifecycle.
  - Maps trees in the global store to Sidebar items with drag-and-drop reordering.
  - Hosts the Topbar, Sidebar, and the active SkilltreeEditor panel.
  - Shows a home page when no skilltree is selected, with option to load defaults.
  - Wraps app with i18n modal providers (ConfirmProvider, AlertProvider).

  Notes
  - All data edits flow through the Zustand store; autosave subscribes and persists to localStorage.
  - Default examples are loaded on-demand via Load Defaults button, not automatically.
*/
import React, {useEffect, useMemo} from 'react'
import { useTranslation } from 'react-i18next'
import Topbar from '../components/layout/Topbar'
import Sidebar, {SidebarItem} from '../components/layout/Sidebar'
import {useStore} from '../state/store'
import {loadExampleTrees} from '../lib/codec/json-io'
import type {SkilltreeFile} from '../lib/types'
import SkilltreeEditor from '../components/editor/SkilltreeEditor'
import {loadDraftFromStorage, setupAutosave, setupBeforeUnloadWarning} from '../state/autosave'
import { ConfirmProvider, useConfirm } from '../components/modals/ConfirmModal'
import { AlertProvider, useAlert } from '../components/modals/AlertModal'
import LanguageSelector from '../components/i18n/LanguageSelector'

/** Root application component - wraps with providers */
export default function App() {
    return (
        <AlertProvider>
            <ConfirmProvider>
                <AppContent />
            </ConfirmProvider>
        </AlertProvider>
    )
}

/** Inner app content that can use hooks */
function AppContent() {
    const { t } = useTranslation()
    const confirm = useConfirm()
    const alert = useAlert()

    const trees = useStore(s => s.trees)
    const selectedId = useStore(s => s.selectedId)
    const setTrees = useStore(s => s.setTrees)
    const select = useStore(s => s.select)
    const del = useStore(s => s.deleteTree)
    const markSaved = useStore(s => s.markSaved)

    // Restore local draft first (runs once)
    useEffect(() => {
        const draft = loadDraftFromStorage()
        if (draft && draft.length) {
            setTrees(draft, {hydrated: true})
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Load default example trees on demand (with confirmation if trees exist)
    const onLoadDefaults = async () => {
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

    // Start autosave and beforeunload warning
    useEffect(() => {
        const stopAutosave = setupAutosave()
        const stopWarn = setupBeforeUnloadWarning()
        return () => {
            stopAutosave();
            stopWarn()
        }
    }, [])

    // Map store trees to sidebar items
    const items: SidebarItem[] = useMemo(() => {
        return trees
            .slice()
            .sort((a, b) => a.Order - b.Order)
            .map(tr => ({
                id: tr.ID,
                name: tr.Name,
                subtitle: t('sidebar.order', { order: tr.Order }),
                icon: tr.Icon?.Material,
                selected: tr.ID === selectedId,
            }))
    }, [trees, selectedId, t])

    // onCreate – create a basic empty tree quickly
    const onCreate = async () => {
        // Use native prompt for now (can be replaced with custom modal later)
        const id = prompt('New skilltree ID (no spaces):', 'NewTree')?.trim()
        if (!id) return
        if (trees.some(t => t.ID === id)) {
            await alert(t('modals.alert.duplicateId'))
            return
        }
        const order = (trees.reduce((m, t) => Math.max(m, t.Order), -1) + 1) || 0
        const blank: SkilltreeFile = {
            ID: id,
            Name: id,
            Order: order,
            Icon: {Material: 'writable_book'},
            Description: [],
            MobTypes: ['*'],
            Skills: {}
        }
        setTrees([...trees, blank])
        select(id)
    }

    const onDelete = async (id: string) => {
        const ok = await confirm(t('modals.confirm.deleteTree', { id }))
        if (!ok) return
        del(id)
    }

    const onReorder = (fromIndex: number, toIndex: number) => {
        if (fromIndex === toIndex) return
        const arr = trees.slice()
        const [moved] = arr.splice(fromIndex, 1)
        arr.splice(toIndex, 0, moved)
        // Re-number Order sequentially to reflect new position
        const renumbered = arr.map((t, i) => ({ ...t, Order: i }))
        setTrees(renumbered)
    }

    const selectedTree = trees.find(t => t.ID === selectedId)

    return (
        <div className="app-grid">
            <Topbar
                onSave={() => markSaved()}
                onHome={() => select(null)}
                rightSlot={
                    <>
                        <LanguageSelector />
                        <button
                            className="btn btn--icon"
                            onClick={() => window.open('https://wiki.mypet-plugin.de/systems/skilltrees', '_blank')}
                            title={t('tooltip.openDocs')}
                            aria-label={t('tooltip.openDocs')}
                        >
                            📄
                        </button>
                    </>
                }
            />

            <Sidebar
                items={items}
                onSelect={select}
                onCreate={onCreate}
                onDelete={onDelete}
                onReorder={onReorder}
                footerSlot={
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4}}>
                        <small style={{opacity: 0.7}}>built with ❤️ by <a href="https://github.com/UserDerezzed" target="_blank" rel="noopener noreferrer" style={{color: 'inherit'}}>UserDerezzed</a></small>
                        <a
                            href="https://ko-fi.com/UserDerezzed"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn--tip"
                            title="Support this project on Ko-fi"
                        >
                            ☕ Tip
                        </a>
                    </div>
                }
            />

            <main className="main">
                {!selectedTree ? (
                    <div className="home-page">
                        <img src="img/logo_16.png" alt="MyPet Logo" className="home-page__logo" draggable={false} />
                        <h2>{t('home.title')}</h2>
                        <p>{t('home.description')}</p>
                        <button className="btn btn--primary home-page__cta" onClick={onLoadDefaults}>
                            {t('home.loadDefaultsCta')}
                        </button>
                    </div>
                ) : (
                    <SkilltreeEditor/>
                )}
            </main>
        </div>
    )
}