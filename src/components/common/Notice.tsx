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
  Notice.tsx — Inline alert/notice component with variants.

  Variants
  - info (default), warning, error, success — each maps to semantic colors and a symbol.

  Accessibility
  - Uses role="alert" for error (assertive), and role="status" for others.
  - Icon is marked aria-hidden; the textual children convey the message.

  Usage
  <Notice variant="warning">Be careful!</Notice>
*/
import React from 'react'

/** Visual style variant for the Notice component. */
export type NoticeVariant = 'info' | 'warning' | 'error' | 'success'

/** Props for Notice. Extends standard div attributes for flexibility. */
interface NoticeProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Visual theme variant; defaults to 'info'. */
  variant?: NoticeVariant
  /** Optional icon override; when omitted, a sensible default is used. */
  icon?: React.ReactNode
  /** Compact mode reduces padding for tighter layouts. */
  compact?: boolean
  /** Notice content (text or elements). */
  children: React.ReactNode
}

/** Map a variant to default colors and icon. */
function getDefaults(variant: NoticeVariant) {
  switch (variant) {
    case 'error':
      return {
        bg: '#ffe8e8',
        border: '#ffb3b3',
        color: '#7a0000',
        icon: '✖',
      }
    case 'warning':
      return {
        bg: '#fff8e1',
        border: '#ffecb3',
        color: '#7a5d00',
        icon: '⚠',
      }
    case 'success':
      return {
        bg: '#e7f7ec',
        border: '#9dd5b1',
        color: '#165',
        icon: '✔',
      }
    case 'info':
    default:
      return {
        bg: '#eef5ff',
        border: '#c8ddff',
        color: '#053366',
        icon: 'ℹ',
      }
  }
}

/** Inline alert with semantic variant styling and ARIA roles. */
export function Notice({ variant = 'info', icon, compact, children, style, ...rest }: NoticeProps) {
  const def = getDefaults(variant)
  const pad = compact ? '6px 10px' : '8px 12px'
  return (
    <div
      role={variant === 'error' ? 'alert' : 'status'}
      style={{
        padding: pad,
        borderRadius: 6,
        background: def.bg,
        border: `2px solid ${def.border}`,
        color: def.color,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        ...style,
      }}
      {...rest}
    >
      <span aria-hidden="true">{icon ?? def.icon}</span>
      <div style={{ lineHeight: 1.35 }}>{children}</div>
    </div>
  )
}

export default Notice
