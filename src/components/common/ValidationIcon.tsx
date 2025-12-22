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
  ValidationIcon.tsx — Reusable validation error indicator.

  Displays a bold red "!" in a circle to indicate validation errors.
  Used in sidebar tree items and potentially other locations.
*/

import React from 'react'

type Props = {
    /** Tooltip text shown on hover */
    title?: string
    /** Icon diameter in pixels */
    size?: number
    /** Additional CSS class names */
    className?: string
}

/**
 * ValidationIcon — Red exclamation mark in a circle indicating an error.
 */
export default function ValidationIcon({
    title = 'Validation error',
    size = 16,
    className = ''
}: Props) {
    return (
        <span
            className={`validation-icon ${className}`.trim()}
            title={title}
            aria-label={title}
            role="img"
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: size,
                height: size,
                minWidth: size,
                borderRadius: '50%',
                fontSize: size * 0.7,
                fontWeight: 'bold',
                lineHeight: 1,
                flexShrink: 0
            }}
        >!</span>
    )
}
