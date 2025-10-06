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
  store.ts — Global Zustand store for the Skilltree Creator.

  State includes:
  - trees: array of SkilltreeFile drafts
  - selectedId: currently selected tree id
  - autosaveStatus/lastSavedAt: UI state for autosave pill

  Actions provide CRUD over trees and helpers for autosave lifecycle.
*/
import {create} from 'zustand'
import type {SkilltreeFile} from '../lib/types'

/** Autosave UI state */
export type AutosaveStatus = 'saved' | 'autosaving' | 'pending'

/** Options for setTrees */
type SetTreesOpts = { hydrated?: boolean }

/** Root state shape */
type State = {
    trees: SkilltreeFile[]
    selectedId: string | null
    // autosave
    autosaveStatus: AutosaveStatus
    lastSavedAt?: number
}

/** Action methods exposed by the store */
type Actions = {
    /** Replace entire trees array. If hydrated is true, mark as saved. */
    setTrees: (t: SkilltreeFile[], opts?: SetTreesOpts) => void
    /** Change current selection by id (or null). */
    select: (id: string | null) => void
    /** Insert or replace a tree; tracks selection and marks pending. */
    upsertTree: (t: SkilltreeFile) => void
    /** Remove a tree by id; advances selection to first if needed. */
    deleteTree: (id: string) => void
    /** Manually mark saved and stamp time. */
    markSaved: () => void
    // internal helpers for autosave
    _markPending: () => void
    _markAutosaving: () => void
    _markSavedAt: (ts: number) => void
}

export const useStore = create<State & Actions>((set, get) => ({
    trees: [],
    selectedId: null,

    autosaveStatus: 'saved',
    lastSavedAt: undefined,

    setTrees: (t, opts) => set((s) => ({
        trees: t,
        selectedId: t.some(x => x.ID === s.selectedId) ? s.selectedId : (t[0]?.ID ?? null),
        autosaveStatus: opts?.hydrated ? 'saved' : 'pending',
        lastSavedAt: opts?.hydrated ? Date.now() : s.lastSavedAt,
    })),

    select: (id) => set({selectedId: id}),

    upsertTree: (t) => set((s) => {
        // 1) Try to find by NEW id
        const idxById = s.trees.findIndex(x => x.ID === t.ID)
        // 2) Fallback: replace the currently selected tree (this covers renames)
        const idxSelected = s.trees.findIndex(x => x.ID === s.selectedId)

        const idx = idxById !== -1 ? idxById : idxSelected

        let trees: SkilltreeFile[]
        if (idx !== -1) {
            trees = s.trees.slice()
            trees[idx] = t
        } else {
            // no selection / first insert
            trees = [...s.trees, t]
        }

        return {
            trees,
            selectedId: t.ID,             // follow the rename
            autosaveStatus: 'pending',
        }
    }),

    deleteTree: (id) => set((s) => {
        const next = s.trees.filter(x => x.ID !== id)
        const nextSel = s.selectedId === id ? (next[0]?.ID ?? null) : s.selectedId
        return {trees: next, selectedId: nextSel, autosaveStatus: 'pending'}
    }),

    markSaved: () => set({autosaveStatus: 'saved', lastSavedAt: Date.now()}),

    _markPending: () => set({autosaveStatus: 'pending'}),
    _markAutosaving: () => set({autosaveStatus: 'autosaving'}),
    _markSavedAt: (ts) => set({autosaveStatus: 'saved', lastSavedAt: ts}),
}))