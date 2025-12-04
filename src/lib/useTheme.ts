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
  useTheme.ts — Theme management hook with system preference detection and persistence.

  Responsibilities:
  - Detect OS-level dark mode preference via matchMedia
  - Persist user preference to localStorage
  - Apply theme to DOM via data-theme attribute
  - React to system preference changes when in 'system' mode
*/
import { useEffect, useState, useCallback } from 'react'

const STORAGE_KEY = 'mypet-skilltree-creator/v1/theme'

export type ThemePreference = 'light' | 'dark' | 'system'
export type EffectiveTheme = 'light' | 'dark'

/** Get system color scheme preference from OS */
function getSystemTheme(): EffectiveTheme {
    if (typeof window === 'undefined') return 'light'
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/** Load persisted theme preference from localStorage */
function loadThemePreference(): ThemePreference {
    try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored === 'light' || stored === 'dark' || stored === 'system') {
            return stored
        }
    } catch {
        // localStorage unavailable (e.g., Safari private mode)
    }
    return 'system'
}

/** Save theme preference to localStorage */
function saveThemePreference(pref: ThemePreference): void {
    try {
        localStorage.setItem(STORAGE_KEY, pref)
    } catch {
        // Ignore storage errors
    }
}

/** Resolve preference to actual theme */
function resolveTheme(pref: ThemePreference): EffectiveTheme {
    return pref === 'system' ? getSystemTheme() : pref
}

/** Apply theme to document via data-theme attribute */
function applyTheme(theme: EffectiveTheme): void {
    if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark')
    } else {
        document.documentElement.removeAttribute('data-theme')
    }
}

/**
 * Hook managing theme preference with system detection and persistence.
 *
 * @returns [currentTheme, preference, setPreference]
 * - currentTheme: The actual theme being rendered ('light' | 'dark')
 * - preference: User's preference ('light' | 'dark' | 'system')
 * - setPreference: Function to change preference
 */
export function useTheme() {
    const [preference, setPreferenceState] = useState<ThemePreference>(loadThemePreference)
    const [currentTheme, setCurrentTheme] = useState<EffectiveTheme>(() => resolveTheme(preference))

    // Apply theme on mount, when preference changes, and listen for system changes
    useEffect(() => {
        const resolved = resolveTheme(preference)
        setCurrentTheme(resolved)
        applyTheme(resolved)

        // Only set up system listener if in 'system' mode
        if (preference !== 'system') return

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        const handler = () => {
            const systemTheme = getSystemTheme()
            setCurrentTheme(systemTheme)
            applyTheme(systemTheme)
        }

        mediaQuery.addEventListener('change', handler)
        return () => mediaQuery.removeEventListener('change', handler)
    }, [preference])

    // Memoized setter that also persists
    const setPreference = useCallback((newPref: ThemePreference) => {
        saveThemePreference(newPref)
        setPreferenceState(newPref)
    }, [])

    return [currentTheme, preference, setPreference] as const
}
