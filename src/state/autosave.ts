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
  autosave.ts — Draft persistence in localStorage and unload protection.

  Responsibilities:
  - loadDraftFromStorage: bootstrap existing draft from localStorage
  - setupAutosave: subscribe to store changes and debounce writes
  - setupBeforeUnloadWarning: warn user when unsaved changes exist
*/
import {useStore} from './store'
import type {SkilltreeFile} from '../lib/types'

const STORAGE_KEY = 'mypet-skilltree-creator/v1/trees'
let timer: number | null = null

/** Load an existing draft array from localStorage or null if not present/invalid. */
export function loadDraftFromStorage(): SkilltreeFile[] | null {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return null
        const parsed = JSON.parse(raw)
        if (!Array.isArray(parsed)) return null
        return parsed
    } catch {
        return null
    }
}

function saveToStorage(trees: SkilltreeFile[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trees))
}

export function setupAutosave() {
    // subscribe to *any* store change; debounce writes based on trees changes
    type RootState = ReturnType<typeof useStore.getState>
    const unsub = useStore.subscribe((state: RootState, prev: RootState) => {
        // Only react when the trees reference actually changed
        if (state.trees === prev.trees) return
        // Only autosave for real edits (store marks them as 'pending')
        if (state.autosaveStatus !== 'pending') return

        const {_markAutosaving, _markSavedAt} = useStore.getState()
        if (timer !== null) window.clearTimeout(timer)
        // debounce ~800ms to avoid thrashing while typing
        timer = window.setTimeout(() => {
            _markAutosaving()
            try {
                saveToStorage(state.trees)
                _markSavedAt(Date.now())
            } catch {
                // ignore; next cycle will try again
            }
        }, 800)
    })

    return () => {
        if (timer !== null) window.clearTimeout(timer)
        unsub()
    }
}

export function setupBeforeUnloadWarning() {
    const handler = (e: BeforeUnloadEvent) => {
        const {autosaveStatus} = useStore.getState()
        if (autosaveStatus === 'pending' || autosaveStatus === 'autosaving') {
            e.preventDefault()
            // Chrome requires returnValue to be set
            e.returnValue = ''
        }
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
}