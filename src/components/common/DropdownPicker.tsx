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
  DropdownPicker.tsx — Small unstyled dropdown/select component.

  Behavior
  - Renders a button that opens a popover list of options; clicking outside
    closes the list (document click listener).
  - Supports custom option rendering (e.g., icons) via renderOption.
  - Displays a placeholder when no current value is present.

  Accessibility
  - The list uses role="listbox" and options use role="option".
  - Consumers should provide surrounding labels as appropriate.
*/
import React from 'react'
import { useTranslation } from 'react-i18next'

/** Props for the DropdownPicker component */
export type DropdownPickerProps = {
  /** List of available option strings to choose from (unique, stable). */
  options: string[]
  /** Currently selected value (should be one of options or empty). */
  value: string
  /** Change handler invoked when an option is picked. */
  onChange: (v: string) => void
  /** Placeholder text shown when no value is selected. */
  placeholder?: string
  /**
   * Optional custom renderer for an option label. Useful to prepend icons
   * or format entries. Receives the option string.
   */
  renderOption?: (opt: string) => React.ReactNode
}

/** Lightweight dropdown popover for picking from a list of strings. */
export default function DropdownPicker({ options, value, onChange, placeholder, renderOption }: DropdownPickerProps) {
  const { t } = useTranslation()
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!ref.current) return
      if (!ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [])

  const current = value && options.includes(value) ? value : (options[0] ?? '')
  const label = current || ''

  return (
    <div ref={ref} style={{position: 'relative'}}>
      <button type="button" className="input" onClick={() => setOpen(v => !v)} style={{minWidth: 220, display: 'flex', alignItems: 'center', gap: 8}}>
        {label ? (
          <>
            {renderOption ? renderOption(label) : <span>{label}</span>}
          </>
        ) : (
          <span>{placeholder ?? t('common.none')}</span>
        )}
      </button>
      {open && (
        <div role="listbox" className="dropdown-picker__list" style={{position: 'absolute', zIndex: 10, top: 'calc(100% + 4px)', left: 0, minWidth: 220, background: 'var(--panel)', border: '2px solid var(--line)', borderRadius: 8, boxShadow: '0 6px 24px rgba(0,0,0,0.15)'}}>
          {options.length === 0 && (
            <div style={{padding: 8, color: 'var(--muted)'}}>{t('common.noOptions')}</div>
          )}
          {options.map(opt => (
            <div key={opt} role="option" aria-selected={opt===current} onClick={() => { onChange(opt); setOpen(false) }} className="dropdown-picker__option" style={{display:'flex', alignItems:'center', gap:8, padding:'6px 8px', cursor:'pointer'}}>
              {renderOption ? renderOption(opt) : <span>{opt}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
