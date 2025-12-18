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
  - Bootstraps state by restoring a local draft (if present) or loading bundled examples.
  - Wires up autosave and beforeunload warning lifecycle.
  - Maps trees in the global store to Sidebar items with drag-and-drop reordering.
  - Hosts the Topbar, Sidebar, and the active SkilltreeEditor panel.

  Notes
  - All data edits flow through the Zustand store; autosave subscribes and persists to localStorage.
  - We avoid overwriting an existing local draft with bundled examples on first load.
*/
import React, {useEffect, useMemo} from 'react'
import Topbar from '../components/layout/Topbar'
import Sidebar, {SidebarItem} from '../components/layout/Sidebar'
import {useStore} from '../state/store'
import {loadExampleTrees} from '../lib/codec/json-io'
import type {SkilltreeFile} from '../lib/types'
import SkilltreeEditor from '../components/editor/SkilltreeEditor'
import {loadDraftFromStorage, setupAutosave, setupBeforeUnloadWarning} from '../state/autosave'

/** Root application component rendering the chrome and current editor. */
export default function App() {
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

    // Load example trees if none present (runs when trees empty)
    useEffect(() => {
        // If a draft exists in localStorage, do not overwrite it with examples
        const hasDraft = !!localStorage.getItem('mypet-skilltree-creator/v1/trees')
        if (!hasDraft && trees.length === 0) {
            loadExampleTrees().then(arr => setTrees(arr, {hydrated: true})).catch(console.error)
        }
    }, [trees.length, setTrees])

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
            .map(t => ({
                id: t.ID,
                name: t.Name,
                subtitle: `Order ${t.Order}`,
                icon: t.Icon?.Material,
                selected: t.ID === selectedId,
            }))
    }, [trees, selectedId])

    // onCreate – create a basic empty tree quickly
    const onCreate = () => {
        const id = prompt('New skilltree ID (no spaces):', 'NewTree')?.trim()
        if (!id) return
        if (trees.some(t => t.ID === id)) return alert('A skilltree with that ID already exists.')
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

    const onDelete = (id: string) => {
        if (!confirm(`Delete skilltree "${id}"?`)) return
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
                    <button
                        className="btn btn--icon"
                        onClick={() => window.open('https://wiki.mypet-plugin.de/systems/skilltrees', '_blank')}
                        title="Open MyPet documentation"
                        aria-label="Open MyPet documentation"
                    >
                        📄
                    </button>
                }
            />

            <Sidebar
                items={items}
                onSelect={select}
                onCreate={onCreate}
                onDelete={onDelete}
                onReorder={onReorder}
                footerSlot={<small style={{opacity: 0.7}}>v{__APP_VERSION__}</small>}
            />

            <main className="main">
                {!selectedTree ? (
                    <p>Select a skilltree on the left, or import .st.json files.</p>
                ) : (
                    <SkilltreeEditor/>
                )}
            </main>
        </div>
    )
}