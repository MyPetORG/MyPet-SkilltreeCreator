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
import { useTranslation } from 'react-i18next'
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
  const m = /^\s*([A-Za-z]*)\s*:\s*(.*)$/.exec(trimmed)
  if (m) {
    const keyRaw = m[1]
    const key = keyRaw.toLowerCase()
    const val = m[2]
    if (key === 'permission') return { type: 'permission', value: val }
    if (key === 'skilltree' || key === 'skilltrees') return { type: 'skilltree', value: val }
    // unknown key (including empty) → custom
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
  const { t } = useTranslation()
  const selectedId = useStore(s => s.selectedId)
  const tree = useStore(s => s.trees.find(tr => tr.ID === selectedId))
  const trees = useStore(s => s.trees)
  const upsertTree = useStore(s => s.upsertTree)

  const [open, setOpen] = useState<Record<number, boolean>>({})

  if (!tree) return null

  const apply = (mutate: (tr: SkilltreeFile) => void) => {
    const next: SkilltreeFile = JSON.parse(JSON.stringify(tree))
    mutate(next)
    upsertTree(next)
  }

  const entries: ReqItem[] = (tree.Requirements || []).map(parseReq)
  const otherTrees = useMemo(() => trees.filter(tr => tr.ID !== tree.ID), [trees, tree.ID])

  const addRequirement = () => {
    // default to Skilltree, pick first other tree id if available
    const defVal = otherTrees[0]?.ID || ''
    apply(tr => { tr.Requirements = [...(tr.Requirements || []), formatReq({ type: 'skilltree', value: defVal })] })
    setOpen(o => ({ ...o, [entries.length]: true }))
  }

  const removeAt = (idx: number) => {
    apply(tr => { tr.Requirements = (tr.Requirements || []).filter((_, i) => i !== idx) })
  }

  const updateAt = (idx: number, item: ReqItem) => {
    apply(tr => {
      const list = [...(tr.Requirements || [])]
      list[idx] = formatReq(item)
      tr.Requirements = list
    })
  }

  const toggle = (idx: number) => setOpen(o => ({ ...o, [idx]: !o[idx] }))

  return (
    <section className="card">
      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0 }}>{t('requirements.title')}</h3>
        <button className="btn" onClick={addRequirement}>{t('requirements.addRequirement')}</button>
      </div>

      <div className="form-grid">
        <div className="field">
          <label className="label">{t('requirements.minLevel')}</label>
          <input
            className="input"
            type="number"
            min={0}
            value={tree.RequiredLevel ?? ''}
            onChange={e => {
              const v = e.currentTarget.value
              apply(tr => { tr.RequiredLevel = v === '' ? undefined : Math.max(0, Number(v)) })
            }}
            placeholder={t('requirements.minLevelPlaceholder')}
          />
        </div>
        <div className="field">
          <label className="label">{t('requirements.maxLevel')}</label>
          <input
            className="input"
            type="number"
            min={0}
            value={tree.MaxLevel ?? ''}
            onChange={e => {
              const v = e.currentTarget.value
              apply(tr => { tr.MaxLevel = v === '' ? undefined : Math.max(0, Number(v)) })
            }}
            placeholder={t('requirements.maxLevelPlaceholder')}
          />
        </div>

        {(entries.length === 0) && (
          <div className="field span-2">
            <Notice variant="warning">
              {t('requirements.noRequirements')}
            </Notice>
          </div>
        )}

        {entries.map((it, idx) => {
          const isOpen = open[idx] ?? true
          const title = it.type === 'permission' ? t('requirements.permission') : t('requirements.skilltree')
          return (
            <div key={idx} className="field span-2" style={{ border: '2px solid var(--line)', borderRadius: 10, padding: 10, background: 'var(--bg)', marginBottom: 8 }}>
              <div className="section-header" style={{ marginBottom: 6 }}>
                <strong style={{ cursor: 'pointer' }} onClick={() => toggle(idx)}>{title}</strong>
                <div>
                  <button className="btn btn--icon" title={t('tooltip.delete')} onClick={() => removeAt(idx)}>🗑️</button>
                </div>
              </div>

              {isOpen && (
                <div>
                  <div className="form-grid" style={{ marginBottom: 8 }}>
                    <div className="field span-2">
                      <label className="label">{t('requirements.requirementType')}</label>
                      <select
                        className="input"
                        value={it.type}
                        onChange={e => {
                          const nextType = e.currentTarget.value as ReqKind
                          if (nextType === 'custom') {
                            updateAt(idx, { type: 'custom', key: '', value: '' })
                          } else if (nextType === 'no-skilltree') {
                            updateAt(idx, { type: 'no-skilltree' })
                          } else {
                            updateAt(idx, { type: nextType, value: '' })
                          }
                        }}
                      >
                        <option value="skilltree">{t('requirements.skilltree')}</option>
                        <option value="no-skilltree">{t('requirements.noSkilltree')}</option>
                        <option value="permission">{t('requirements.permission')}</option>
                        <option value="custom">{t('requirements.custom')}</option>
                      </select>
                    </div>

                    {it.type === 'skilltree' && (
                      <div className="field span-2">
                        <label className="label">{t('requirements.skilltree')}</label>
                        <select
                          className="input"
                          value={it.value}
                          onChange={e => updateAt(idx, { ...it, value: e.currentTarget.value })}
                        >
                          <option value=""></option>
                          {otherTrees.map(tr => (
                            <option key={tr.ID} value={tr.ID}>{tr.Name || tr.ID}</option>
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
                          <label className="label">{t('requirements.permission')}</label>
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <span className="perm-prefix">{t('requirements.permissionPrefix')}</span>
                            <input
                              className="input"
                              type="text"
                              value={suffix}
                              placeholder={t('requirements.permissionPlaceholder')}
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
                              title={t('requirements.copyPermission')}
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
                          <label className="label">{t('requirements.customKey')}</label>
                          <input
                            className="input"
                            type="text"
                            value={(it.key ?? '')}
                            placeholder={t('requirements.customKeyPlaceholder')}
                            onChange={e => updateAt(idx, { ...it, key: e.currentTarget.value })}
                          />
                        </div>
                        <div className="field">
                          <label className="label">{t('requirements.customValue')}</label>
                          <input
                            className="input"
                            type="text"
                            value={(it.value ?? '')}
                            placeholder={t('requirements.customValuePlaceholder')}
                            onChange={e => updateAt(idx, { ...it, value: e.currentTarget.value })}
                          />
                        </div>
                      </>
                    )}

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
