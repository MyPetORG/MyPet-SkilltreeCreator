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
  ThemeToggle.tsx — Sun/moon icon button for theme switching.

  Simple toggle between light and dark modes.
  Icon reflects the current theme (sun in dark mode = "click for light").
*/
import React from 'react'
import { useTheme } from '../../lib/useTheme'

/** Theme toggle button showing sun/moon icon. */
export default function ThemeToggle() {
    const [currentTheme, , setPreference] = useTheme()

    const handleClick = () => {
        // Simple toggle: light ↔ dark
        setPreference(currentTheme === 'dark' ? 'light' : 'dark')
    }

    // Sun shown in dark mode (click to go light), moon in light mode (click to go dark)
    const icon = currentTheme === 'dark' ? '☀️' : '🌙'
    const title = currentTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'

    return (
        <button
            className="btn btn--icon"
            onClick={handleClick}
            title={title}
            aria-label={title}
        >
            {icon}
        </button>
    )
}
