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
  NotificationsEditor.tsx — Configure in-game chat notifications for level-ups.

  Allows adding, editing, and removing notification templates keyed by level
  specifications (fixed list like "1,3" or dynamic like "%1>1<100"). Includes
  a live preview with sample variable substitutions.
*/
import React, { useMemo, useState } from 'react'
import { useStore } from '../../state/store'
import LevelModal, { LevelSelection } from '../modals/LevelModal'
import RichTextPreviewEditor from '../common/RichTextPreviewEditor'

/**
 * Convert a level key ("1", "1,3", or dynamic like "%1>5<100") into a human-readable label.
 */
function humanizeLevel(level: string): string {
  if (/^\d+$/.test(level)) return `Level ${level}`
  if (/^\d+(?:,\d+)+$/.test(level)) return `Level: ${level.split(',').join(', ')}`
  const m = /^%(\d+)(?:>(\d+))?(?:<(\d+))?$/.exec(level)
  if (!m) return `Level ${level}`
  const every = Number(m[1])
  const start = m[2] != null ? Number(m[2]) : undefined
  const until = m[3] != null ? Number(m[3]) : undefined
  let text = every === 1 ? 'Every level' : `Every ${every} levels`
  if (start != null && until != null) text += ` between levels ${start} and ${until}`
  else if (start != null) text += ` from level ${start} onward`
  else if (until != null) text += ` up to level ${until}`
  return text
}

/**
 * Parse a level key string into a LevelSelection structure used by the modal.
 * Returns undefined on invalid input.
 */
function parseSelection(level: string): LevelSelection | undefined {
  if (/^\d+$/.test(level)) return { type: 'fixed', levels: [Number(level)] }
  if (/^\d+(?:,\d+)+$/.test(level)) {
    const levels = level.split(',').map(n => Number(n)).filter(n => Number.isFinite(n) && n > 0)
    return { type: 'fixed', levels }
  }
  const m = /^%(\d+)(?:>(\d+))?(?:<(\d+))?$/.exec(level)
  if (!m) return undefined
  const every = Number(m[1])
  const start = m[2] != null ? Number(m[2]) : undefined
  const until = m[3] != null ? Number(m[3]) : undefined
  return { type: 'dynamic', every, start, until }
}

/**
 * Render preview by replacing template variables with sample values.
 * This does not implement full formatting; it's only for in-UI previews.
 */
function renderPreview(tpl: string, levelNumber = 56) {
  // very tiny preview replacement
  return tpl
    .replace(/\{\{owner}\}/g, 'Keyle')
    .replace(/\{\{pet}\}/g, 'Wolfi')
    .replace(/\{\{level}\}/g, String(levelNumber))
}

/**
 * NotificationsEditor — manage level-up notification templates for a skilltree.
 * Uses LevelModal to add/edit level keys and RichTextPreviewEditor to edit messages.
 */
export default function NotificationsEditor() {
  const tree = useStore(s => s.trees.find(t => t.ID === s.selectedId))
  const upsertTree = useStore(s => s.upsertTree)

  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<string | null>(null)

  const notifications = useMemo(() => tree?.Notifications ?? {}, [tree])

  if (!tree) return null

  const addFromSelection = (sel: LevelSelection) => {
    const next = structuredClone(tree)
    next.Notifications = next.Notifications ?? {}
    if (sel.type === 'fixed') {
      const uniqSorted = Array.from(new Set(sel.levels.filter(n => Number.isFinite(n) && n > 0).map(n => Math.floor(n)))).sort((a,b)=>a-b)
      if (uniqSorted.length === 0) return
      const key = uniqSorted.join(',')
      if (!(key in next.Notifications)) next.Notifications[key] = ''
    } else {
      const key = `%${sel.every}` + (sel.start != null ? `>${sel.start}` : '') + (sel.until != null ? `<${sel.until}` : '')
      if (!(key in next.Notifications)) next.Notifications[key] = ''
    }
    upsertTree(next)
  }

  const updateMessage = (levelKey: string, msg: string) => {
    const next = structuredClone(tree)
    next.Notifications = next.Notifications ?? {}
    next.Notifications[levelKey] = msg
    upsertTree(next)
  }

  const removeNotification = (levelKey: string) => {
    const next = structuredClone(tree)
    if (next.Notifications) delete next.Notifications[levelKey]
    upsertTree(next)
  }

  const editLevelKey = (origLevel: string, sel: LevelSelection) => {
    const next = structuredClone(tree)
    const payload = next.Notifications?.[origLevel]
    if (payload == null) return
    let newKey: string
    if (sel.type === 'fixed') {
      const uniqSorted = Array.from(new Set(sel.levels.filter(n => Number.isFinite(n) && n > 0).map(n => Math.floor(n)))).sort((a,b)=>a-b)
      if (uniqSorted.length === 0) return
      newKey = uniqSorted.join(',')
    } else {
      newKey = `%${sel.every}` + (sel.start != null ? `>${sel.start}` : '') + (sel.until != null ? `<${sel.until}` : '')
    }
    if (newKey === origLevel) return
    next.Notifications![newKey] = payload
    delete next.Notifications![origLevel]
    upsertTree(next)
  }

  return (
    <section className="editor-panel">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h3 style={{margin: 0}}>Notifications</h3>
        <button className="btn" onClick={() => setAddOpen(true)}>＋ Add notification</button>
      </div>

      {Object.keys(notifications).length === 0 && (
        <p style={{color:'var(--muted)'}}>No notifications yet.</p>
      )}

      {Object.entries(notifications).map(([level, msg]) => (
        <div key={level} style={{border:'1px solid #e3e3e3', borderRadius:8, padding:12, marginTop:10}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <strong>{humanizeLevel(level)}</strong>
            <div style={{display:'flex', gap:6}}>
              <button className="btn btn--icon" title="Edit level" onClick={() => { setEditTarget(level); setEditOpen(true) }}>✏️</button>
              <button className="btn btn--icon" title="Delete" onClick={() => removeNotification(level)}>🗑️</button>
            </div>
          </div>

          <RichTextPreviewEditor
            label="Message"
            value={msg}
            onChange={(v) => updateMessage(level, v)}
            rows={2}
            placeholder="e.g. {{owner}}'s pet {{pet}} has reached level {{level}}!"
            transformPreview={(src) => {
              const sample = /^\d+$/.test(level)
                ? Number(level)
                : (/^\d+(?:,\d+)+$/.test(level)
                    ? Number(level.split(',')[0])
                    : (() => {
                        const m = /^%(\d+)(?:>(\d+))?(?:<(\d+))?$/.exec(level)
                        if (!m) return 1
                        const every = Number(m[1])
                        const start = m[2] != null ? Number(m[2]) : undefined
                        return (start ?? every ?? 1)
                      })())
              return renderPreview(src || "{{owner}}'s pet {{pet}} has reached level {{level}}!", sample)
            }}
          />
        </div>
      ))}

      <LevelModal
        open={addOpen}
        onCancel={() => setAddOpen(false)}
        onSubmit={(sel) => { addFromSelection(sel); setAddOpen(false) }}
        title="Add Notification"
      />
      <LevelModal
        open={editOpen}
        onCancel={() => { setEditOpen(false); setEditTarget(null) }}
        onSubmit={(sel) => { if (editTarget) editLevelKey(editTarget, sel); setEditOpen(false); setEditTarget(null) }}
        initial={editTarget ? parseSelection(editTarget) : undefined}
        title="Edit Notification Level"
      />
    </section>
  )
}
