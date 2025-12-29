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
  RichTextPreviewEditor.tsx — Textarea with MiniMessage preview.

  Features:
  - Toolbar to insert MiniMessage tags (colors, styles, gradients, etc.)
  - HTML preview using minimessage-js library with Minecraft font
  - Display mode selector (Chat/Lore styles)
  - Optional transformPreview to substitute variables for previews
*/
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { toHtmlLore, toHtmlChat, getPreviewModeClass, type DisplayMode } from '../../lib/minimessage'

// Color map for named bracket tags
const NAME_COLORS: Record<string, string> = {
  black: '#000000',
  dark_blue: '#0000aa',
  dark_green: '#00aa00',
  dark_aqua: '#00aaaa',
  dark_red: '#aa0000',
  dark_purple: '#aa00aa',
  gold: '#ffaa00',
  gray: '#aaaaaa',
  dark_gray: '#555555',
  blue: '#5555ff',
  green: '#55ff55',
  aqua: '#55ffff',
  red: '#ff5555',
  light_purple: '#ff55ff',
  yellow: '#ffff55',
  white: '#ffffff',
}

export type RichTextPreviewEditorProps = {
  label?: string
  value: string
  onChange: (next: string) => void
  placeholder?: string
  onBlur?: () => void
  rows?: number
  maxWidth?: number
  transformPreview?: (src: string) => string
  displayMode?: DisplayMode
}

export default function RichTextPreviewEditor({
  label,
  value,
  onChange,
  placeholder,
  onBlur,
  rows,
  maxWidth = 520,
  transformPreview,
  displayMode = 'lore',
}: RichTextPreviewEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const [text, setText] = useState<string>(value)
  const isFocusedRef = useRef(false)

  // Sync from prop only when not focused (external changes like switching trees)
  useEffect(() => {
    if (!isFocusedRef.current) {
      setText(value)
    }
  }, [value])

  // Insert text at caret position
  const insertAtCaret = (insertion: string) => {
    const el = textareaRef.current
    if (!el) return
    const start = el.selectionStart ?? 0
    const end = el.selectionEnd ?? 0
    const next = text.slice(0, start) + insertion + text.slice(end)
    setText(next)
    onChange(next)
    requestAnimationFrame(() => {
      el.focus()
      const caret = start + insertion.length
      el.setSelectionRange(caret, caret)
    })
  }

  // Wrap selected text with opening and closing tags
  const wrapSelection = (openTag: string, closeTag: string) => {
    const el = textareaRef.current
    if (!el) return
    const start = el.selectionStart ?? 0
    const end = el.selectionEnd ?? 0
    const selected = text.slice(start, end)
    const next = text.slice(0, start) + openTag + selected + closeTag + text.slice(end)
    setText(next)
    onChange(next)
    requestAnimationFrame(() => {
      el.focus()
      // Position caret after opening tag if no selection, or after closing tag if there was
      const newCaret = selected ? start + openTag.length + selected.length + closeTag.length : start + openTag.length
      el.setSelectionRange(newCaret, newCaret)
    })
  }

  const colorButtons = Object.entries(NAME_COLORS)

  const styleButtons: { code: string; label: string }[] = [
    { code: '<bold>', label: 'Bold' },
    { code: '<italic>', label: 'Italic' },
    { code: '<underline>', label: 'Underline' },
    { code: '<strikethrough>', label: 'Strike' },
    { code: '<reset>', label: 'Reset' },
  ]

  // TODO: Enable advanced MiniMessage buttons for MyPet v4
  // const advancedButtons: { open: string; close: string; label: string; title: string; chatOnly?: boolean }[] = [
  //   { open: '<gradient:#5e4fa2:#f79459>', close: '</gradient>', label: 'Gradient', title: 'Gradient text (edit colors in tag)' },
  //   { open: '<rainbow>', close: '</rainbow>', label: 'Rainbow', title: 'Rainbow colored text' },
  //   { open: "<hover:show_text:'Tooltip text'>", close: '</hover>', label: 'Hover', title: 'Show tooltip on hover', chatOnly: true },
  //   { open: "<click:run_command:'/command'>", close: '</click>', label: 'Click', title: 'Run command on click', chatOnly: true },
  // ]

  // Generate HTML preview based on display mode
  const previewHtml = useMemo(() => {
    const src = transformPreview ? transformPreview(text) : text
    return displayMode === 'chat' ? toHtmlChat(src) : toHtmlLore(src)
  }, [text, transformPreview, displayMode])

  return (
    <div className="field span-2">
      {label && <label className="label">{label}</label>}

      <div style={{ border: '2px solid var(--line)', borderRadius: 6, padding: 10, maxWidth }}>
        {/* Toolbar */}
        <div className="inline" style={{ gap: 8, flexWrap: 'wrap' as const, alignItems: 'center' }}>
          {/* Color buttons */}
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' as const }}>
            {colorButtons.map(([name, hex]) => {
              const isDark = ['black', 'dark_blue', 'dark_green', 'dark_aqua', 'dark_red', 'dark_purple', 'dark_gray', 'blue'].includes(name)
              const show = name.replace(/_/g, ' ')
              return (
                <button
                  type="button"
                  key={name}
                  className="btn"
                  title={show}
                  aria-label={show}
                  onClick={() => insertAtCaret(`<${name}>`)}
                  style={{
                    padding: 0,
                    backgroundColor: hex,
                    color: isDark ? '#fff' : '#000',
                    border: '2px solid #ccc',
                    width: 22,
                    height: 22,
                    display: 'inline-block',
                  }}
                />
              )
            })}
          </div>

          {/* Style buttons */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const, width: '100%', marginTop: 6 }}>
            {styleButtons.map(b => (
              <button key={b.code} type="button" className="btn" onClick={() => insertAtCaret(b.code)}>
                {b.label}
              </button>
            ))}
          </div>

          {/* TODO: Enable advanced MiniMessage buttons for MyPet v4
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const, width: '100%', marginTop: 6 }}>
            {advancedButtons
              .filter(b => !b.chatOnly || displayMode === 'chat')
              .map(b => (
                <button
                  key={b.label}
                  type="button"
                  className="btn"
                  title={b.title}
                  onClick={() => wrapSelection(b.open, b.close)}
                >
                  {b.label}
                </button>
              ))}
          </div>
          */}
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          className="textarea"
          rows={displayMode === 'chat' ? 1 : (rows ?? Math.max(2, (text.match(/\n/g)?.length ?? 0) + 1))}
          value={text}
          onChange={e => {
            const v = e.target.value
            setText(v)
            onChange(v)
          }}
          onKeyDown={e => {
            // Prevent newlines in chat mode (single-line)
            if (displayMode === 'chat' && e.key === 'Enter') {
              e.preventDefault()
            }
          }}
          onFocus={() => { isFocusedRef.current = true }}
          onBlur={() => {
            isFocusedRef.current = false
            // Sync to latest prop value on blur in case it diverged
            setText(value)
            onBlur?.()
          }}
          placeholder={placeholder ?? 'Enter MiniMessage text. Use toolbar to insert tags.'}
          dir="ltr"
          style={{ direction: 'ltr', unicodeBidi: 'plaintext', resize: 'none', width: '100%' }}
        />

        {/* HTML Preview */}
        <div
          className={`mc-font ${getPreviewModeClass(displayMode)}`}
          dangerouslySetInnerHTML={{ __html: previewHtml || '&nbsp;' }}
        />
      </div>
    </div>
  )
}
