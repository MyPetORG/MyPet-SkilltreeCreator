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
  RequirementsEditor.tsx — Configure level bounds and extra requirements.

  Supports:
  - RequiredLevel / MaxLevel numeric bounds for the pet
  - Arbitrary requirement lines encoded as strings for compatibility
    • Skilltree:<ID>
    • Permission:<node>
    • NoSkilltree
    • <CustomKey>:<value> (preserved as-is)

  The UI presents a friendlier editor over that string storage format.
*/
import React, { useMemo, useState } from 'react'
import { useStore } from '../../state/store'
import type { SkilltreeFile } from '../../lib/types'
import Notice from '../common/Notice'

// Internal model for a requirement entry
// We keep storage as string[] on SkilltreeFile for backward compatibility.
// Supported encodings (case-insensitive keys):
//   "Skilltree:<ID>" — requires the Pet to already have the given skilltree
//   "Permission:<node>" — requires the Player to have the permission node
// Legacy fallback: a bare value without a known key is treated as a Skilltree ID.

type ReqKind = 'skilltree' | 'permission' | 'no-skilltree' | 'custom'
interface ReqItem { type: ReqKind; value?: string; key?: string }

/** Parse a requirement line (string) into a structured ReqItem. */
function parseReq(raw: string): ReqItem {
  const trimmed = raw.trim()
  if (/^NoSkilltree$/i.test(trimmed)) {
    return { type: 'no-skilltree' }
  }
  const m = /^\s*([A-Za-z]+)\s*:\s*(.*)$/.exec(trimmed)
  if (m) {
    const keyRaw = m[1]
    const key = keyRaw.toLowerCase()
    const val = m[2]
    if (key === 'permission') return { type: 'permission', value: val }
    if (key === 'skilltree' || key === 'skilltrees') return { type: 'skilltree', value: val }
    // unknown key → custom
    return { type: 'custom', key: keyRaw, value: val }
  }
  // Fallback: treat as skilltree id
  return { type: 'skilltree', value: trimmed }
}

/** Serialize a structured requirement back to its storage string form. */
function formatReq(item: ReqItem): string {
  switch (item.type) {
    case 'permission':
      return `Permission:${item.value ?? ''}`
    case 'skilltree':
      return `Skilltree:${item.value ?? ''}`
    case 'no-skilltree':
      return 'NoSkilltree'
    case 'custom':
      return `${(item.key ?? '').trim()}:${(item.value ?? '').trim()}`
    default:
      return `${item.value ?? ''}`
  }
}

export default function RequirementsEditor() {
  const selectedId = useStore(s => s.selectedId)
  const tree = useStore(s => s.trees.find(t => t.ID === selectedId))
  const trees = useStore(s => s.trees)
  const upsertTree = useStore(s => s.upsertTree)

  const [open, setOpen] = useState<Record<number, boolean>>({})

  if (!tree) return null

  const apply = (mutate: (t: SkilltreeFile) => void) => {
    const next: SkilltreeFile = JSON.parse(JSON.stringify(tree))
    mutate(next)
    upsertTree(next)
  }

  const entries: ReqItem[] = (tree.Requirements || []).map(parseReq)
  const otherTrees = useMemo(() => trees.filter(t => t.ID !== tree.ID), [trees, tree.ID])

  const addRequirement = () => {
    // default to Skilltree, pick first other tree id if available
    const defVal = otherTrees[0]?.ID || ''
    apply(t => { t.Requirements = [...(t.Requirements || []), formatReq({ type: 'skilltree', value: defVal })] })
    setOpen(o => ({ ...o, [entries.length]: true }))
  }

  const removeAt = (idx: number) => {
    apply(t => { t.Requirements = (t.Requirements || []).filter((_, i) => i !== idx) })
  }

  const updateAt = (idx: number, item: ReqItem) => {
    apply(t => {
      const list = [...(t.Requirements || [])]
      list[idx] = formatReq(item)
      t.Requirements = list
    })
  }

  const toggle = (idx: number) => setOpen(o => ({ ...o, [idx]: !o[idx] }))

  return (
    <section className="card">
      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0 }}>Requirements</h3>
        <button className="btn" onClick={addRequirement}>Add Requirement</button>
      </div>

      <div className="form-grid">
        <div className="field">
          <label className="label">Minimum Pet Level</label>
          <input
            className="input"
            type="number"
            min={0}
            value={tree.RequiredLevel ?? ''}
            onChange={e => {
              const v = e.currentTarget.value
              apply(t => { t.RequiredLevel = v === '' ? undefined : Math.max(0, Number(v)) })
            }}
            placeholder="1"
          />
        </div>
        <div className="field">
          <label className="label">Maximum Pet Level</label>
          <input
            className="input"
            type="number"
            min={0}
            value={tree.MaxLevel ?? ''}
            onChange={e => {
              const v = e.currentTarget.value
              apply(t => { t.MaxLevel = v === '' ? undefined : Math.max(0, Number(v)) })
            }}
            placeholder="10"
          />
        </div>

        {(entries.length === 0) && (
          <div className="field span-2">
            <Notice variant="warning">
              There are no permission, Skilltree, or custom requirements for this Skilltree.
            </Notice>
          </div>
        )}

        {entries.map((it, idx) => {
          const isOpen = open[idx] ?? true
          const title = it.type === 'permission' ? 'Permission' : 'Skilltree'
          return (
            <div key={idx} className="field span-2" style={{ border: '2px solid var(--line)', borderRadius: 10, padding: 10, background: '#fff', marginBottom: 8 }}>
              <div className="section-header" style={{ marginBottom: 6 }}>
                <strong style={{ cursor: 'pointer' }} onClick={() => toggle(idx)}>{title}</strong>
                <div>
                  <button className="btn btn--icon" title="Delete requirement" onClick={() => removeAt(idx)}>🗑️</button>
                </div>
              </div>

              {isOpen && (
                <div>
                  <div className="form-grid">
                    <div className="field span-2">
                      <label className="label">Requirement Type</label>
                      <select
                        className="input"
                        value={it.type}
                        onChange={e => {
                          const nextType = e.currentTarget.value as ReqKind
                          if (nextType === 'custom') {
                            updateAt(idx, { type: 'custom', key: 'CustomName', value: '' })
                          } else if (nextType === 'no-skilltree') {
                            updateAt(idx, { type: 'no-skilltree' })
                          } else {
                            updateAt(idx, { type: nextType, value: '' })
                          }
                        }}
                      >
                        <option value="skilltree">Skilltree</option>
                        <option value="no-skilltree">No Skilltree</option>
                        <option value="permission">Permission</option>
                        <option value="custom">Custom</option>
                      </select>
                    </div>

                    {it.type === 'skilltree' && (
                      <div className="field span-2">
                        <label className="label">Skilltree</label>
                        <select
                          className="input"
                          value={it.value}
                          onChange={e => updateAt(idx, { ...it, value: e.currentTarget.value })}
                        >
                          <option value=""></option>
                          {otherTrees.map(t => (
                            <option key={t.ID} value={t.ID}>{t.Name || t.ID}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {it.type === 'permission' && (() => {
                      const PERM_PREFIX = 'MyPet.skilltree.'
                      const rawVal = it.value || ''
                      const suffix = rawVal.startsWith(PERM_PREFIX) ? rawVal.slice(PERM_PREFIX.length) : rawVal
                      const full = (suffix ? PERM_PREFIX + suffix.replace(/^MyPet\.skilltree\./i, '') : PERM_PREFIX)
                      return (
                        <div className="field span-2">
                          <label className="label">Permission</label>
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <span style={{ padding: '6px 8px', background: '#f3f3f5', border: '1px solid var(--border)', borderRadius: 6, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \'Liberation Mono\', \'Courier New\', monospace' }}>MyPet.skilltree.</span>
                            <input
                              className="input"
                              type="text"
                              value={suffix}
                              placeholder="TestPermission"
                              onChange={e => {
                                const nextSuffix = e.currentTarget.value
                                const nextFull = PERM_PREFIX + nextSuffix.replace(/^MyPet\.skilltree\./i, '')
                                updateAt(idx, { ...it, value: nextFull })
                              }}
                              style={{ flex: 1 }}
                            />
                            <button
                              className="btn"
                              type="button"
                              title="Copy permission"
                              onClick={() => navigator.clipboard?.writeText(full)}
                            >
                              📋
                            </button>
                          </div>
                        </div>
                      )
                    })()}

                    {it.type === 'custom' && (
                      <>
                        <div className="field">
                          <label className="label">Custom Key</label>
                          <input
                            className="input"
                            type="text"
                            value={(it.key ?? '')}
                            placeholder="CustomName"
                            onChange={e => updateAt(idx, { ...it, key: e.currentTarget.value })}
                          />
                        </div>
                        <div className="field">
                          <label className="label">Custom Value</label>
                          <input
                            className="input"
                            type="text"
                            value={(it.value ?? '')}
                            placeholder="BoopBeep"
                            onChange={e => updateAt(idx, { ...it, value: e.currentTarget.value })}
                          />
                        </div>
                      </>
                    )}

                    <div className="field span-2" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button className="btn" style={{ background: '#e7f7ec', color: '#165', borderColor: '#9dd5b1' }} onClick={() => removeAt(idx)}>Delete</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
