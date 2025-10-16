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
  RichTextPreviewEditor.tsx — Textarea with Minecraft-styled canvas preview.

  Features:
  - Toolbar to insert bracket-style tags like <red>, <bold>, <reset>
  - Parses each line into styled segments and renders using mcAssets font
  - Optional transformPreview to substitute variables for previews
*/
import React, { useEffect, useRef, useState } from 'react'
import { initMinecraftFont, renderLine, measureTextWidth, type McSegment } from '../../lib/mcAssets'

// Color/style maps for named bracket tags, e.g. <red> <bold>
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
}

export default function RichTextPreviewEditor({ label, value, onChange, placeholder, onBlur, rows, maxWidth = 520, transformPreview }: RichTextPreviewEditorProps) {
  // Raw source textarea
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  // Preview canvas and container
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const previewRef = useRef<HTMLDivElement | null>(null)

  const [text, setText] = useState<string>(value)
  const textRef = useRef<string>(value)

  useEffect(() => {
    setText(value)
    textRef.current = value
  }, [value])

  // Toolbar actions: inserts tokens into textarea at caret
  const insertAtCaret = (insertion: string) => {
    const el = textareaRef.current
    if (!el) return
    const start = el.selectionStart ?? 0
    const end = el.selectionEnd ?? 0
    const next = text.slice(0, start) + insertion + text.slice(end)
    setText(next)
    textRef.current = next
    onChange(next)
    requestAnimationFrame(() => {
      el.focus()
      const caret = start + insertion.length
      el.setSelectionRange(caret, caret)
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

  type SegStyle = { color?: string; bold?: boolean; italic?: boolean; underline?: boolean; strike?: boolean }
  const parseLineToSegments = (text: string): McSegment[] => {
    const segs: McSegment[] = []
    let buf = ''
    let st: SegStyle = {}
    const flush = () => {
      if (!buf) return
      segs.push({ text: buf, style: { ...st } })
      buf = ''
    }
    for (let i = 0; i < text.length; i++) {
      const ch = text[i]
      if (ch === '<') {
        const close = text.indexOf('>', i + 1)
        if (close !== -1) {
          const rawTag = text.slice(i + 1, close).trim().toLowerCase()
          if (rawTag in NAME_COLORS || ['bold','italic','underline','strikethrough','reset'].includes(rawTag)) {
            flush()
            if (rawTag in NAME_COLORS) st = { ...st, color: NAME_COLORS[rawTag] }
            else if (rawTag === 'bold') st = { ...st, bold: true }
            else if (rawTag === 'italic') st = { ...st, italic: true }
            else if (rawTag === 'underline') st = { ...st, underline: true }
            else if (rawTag === 'strikethrough') st = { ...st, strike: true }
            else if (rawTag === 'reset') st = {}
            i = close
            continue
          }
        }
      }
      buf += ch
    }
    flush()
    return segs
  }

  const renderPreview = () => {
    const canvas = canvasRef.current
    const holder = previewRef.current
    if (!canvas || !holder) return
    const rect = holder.getBoundingClientRect()
    const holderWidth = Math.max(1, Math.floor(rect.width))
    const scale = 2 // 8px * 2 = 16px per line height
    const lineHeight = 8 * scale + 4 // include small gap
    const src = textRef.current ?? ''
    const transformed = transformPreview ? transformPreview(src) : src
    const lines = transformed.split('\n')
    const topPad = 6
    const bottomPad = 6
    const leftPad = 8
    const rightPad = 8
    // Measure the content width (max line)
    let contentWidth = 0
    for (const line of lines) {
      const segs = parseLineToSegments(line)
      const w = measureTextWidth(segs, scale)
      if (w > contentWidth) contentWidth = w
    }
    const desiredWidth = Math.ceil(leftPad + contentWidth + rightPad)
    const cssWidth = Math.max(holderWidth, desiredWidth)
    const height = Math.max(lineHeight + topPad + bottomPad, lines.length * lineHeight + topPad + bottomPad)
    const dpr = window.devicePixelRatio || 1
    canvas.width = Math.ceil(cssWidth * dpr)
    canvas.height = Math.ceil(height * dpr)
    canvas.style.width = `${cssWidth}px`
    canvas.style.height = `${height}px`
    const ctx = canvas.getContext('2d')!
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, cssWidth, height)
    // Render each line
    let y = topPad + (lineHeight - 4)
    for (const line of lines) {
      const segments = parseLineToSegments(line)
      renderLine(ctx, segments, leftPad, y, scale)
      y += lineHeight
    }
  }

  // Init font and resize observer for preview
  useEffect(() => {
    let cancelled = false
    initMinecraftFont().then(() => { if (!cancelled) renderPreview() }).catch(() => {})
    const ro = new ResizeObserver(() => renderPreview())
    if (previewRef.current) ro.observe(previewRef.current)
    return () => { cancelled = true; ro.disconnect() }
  }, [])

  // Re-render when text or preview transform changes
  useEffect(() => {
    renderPreview()
  }, [text, transformPreview])

  return (
    <div className="field span-2">
      {label && <label className="label">{label}</label>}

      <div style={{ border: '2px solid var(--line)', borderRadius: 6, padding: 10, maxWidth }}>
        <div className="inline" style={{ gap: 8, flexWrap: 'wrap' as const, alignItems: 'center' }}>
          {/* Color buttons row */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const }}>
            {colorButtons.map(([name, hex]) => {
              const isDark = ['black','dark_blue','dark_green','dark_aqua','dark_red','dark_purple','dark_gray','blue'].includes(name)
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
                    width: 24,
                    height: 24,
                    display: 'inline-block',
                  }}
                />
              )
            })}
          </div>
          {/* Style buttons on their own line */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const, width: '100%', marginTop: 6 }}>
            {styleButtons.map(b => (
              <button key={b.code} type="button" className="btn" onClick={() => insertAtCaret(b.code)}>{b.label}</button>
            ))}
          </div>
        </div>

        <textarea
          ref={textareaRef}
          className="textarea"
          rows={rows ?? Math.max(1, (text.match(/\n/g)?.length ?? 0) + 1)}
          value={text}
          onChange={(e) => {
            const v = e.target.value
            setText(v)
            textRef.current = v
            onChange(v)
          }}
          onBlur={onBlur}
          placeholder={placeholder ?? 'Enter text. Use toolbar to insert colors/styles.'}
          dir="ltr"
          style={{ direction: 'ltr', unicodeBidi: 'plaintext', resize: 'none', width: '100%' }}
        />

        <div ref={previewRef} style={{ marginTop: 8, border: '2px solid var(--line)', borderRadius: 4, padding: 0, position: 'relative', minHeight: 24, overflowX: 'auto' }}>
          <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
        </div>
      </div>
    </div>
  )
}
