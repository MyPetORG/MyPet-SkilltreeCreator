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
  EligiblePetsEditor.tsx — Select which mobs are eligible for the current skill.

  Fetches the latest entities list from PrismarineJS minecraft-data, presents a
  searchable/selectable grid with spawn egg icons, and writes the selection back
  to the current tree. Supports selecting all (including future updates via '*').
*/
import React, { useEffect, useMemo, useState } from 'react'
import { useStore } from '../../state/store'
import type { SkilltreeFile } from '../../lib/types'
import { ItemIcon } from '../../lib/mcIcons'
import Notice from '../common/Notice'
import { McData, type MobEntry } from '../../lib/mcAssets'

/**
 * EligiblePetsEditor — panel to choose which mobs are allowed for the skilltree.
 * Reads/writes MobTypes on the selected tree in the global store.
 */
export default function EligiblePetsEditor() {
  const selectedId = useStore(s => s.selectedId)
  const tree = useStore(s => s.trees.find(t => t.ID === selectedId))
  const upsertTree = useStore(s => s.upsertTree)

  const [mobs, setMobs] = useState<MobEntry[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setError(null)
      setMobs(null)
      const list = await McData.getMobs()
      if (cancelled) return
      if (!list) {
        setError('Failed to load mob list from minecraft-data')
        setMobs([])
        return
      }
      setMobs(list)
    }

    load()
    return () => { cancelled = true }
  }, [])

  if (!tree) return null

  const apply = (mutate: (t: SkilltreeFile) => void) => {
    const next: SkilltreeFile = JSON.parse(JSON.stringify(tree))
    mutate(next)
    upsertTree(next)
  }

  const isStarAll = tree.MobTypes.includes('*')
  const selected = useMemo(() => new Set(tree.MobTypes.filter(x => x !== '*').map(x => x.toLowerCase())), [tree.MobTypes])
  const allIdsLower = useMemo(() => new Set((mobs || []).map(m => m.id.toLowerCase())), [mobs])
  const isExplicitAll = useMemo(() => {
    if (!mobs || mobs.length === 0) return false
    if (selected.size !== allIdsLower.size) return false
    for (const id of allIdsLower) if (!selected.has(id)) return false
    return true
  }, [mobs, selected, allIdsLower])
  const isAll = isStarAll || isExplicitAll

  const toggle = (id: string) => {
    apply(t => {
      const low = id.toLowerCase()
      if (t.MobTypes.includes('*')) {
        // When all are selected, deselect only the clicked one by expanding
        // to an explicit list of all mobs except this one.
        const allIds = (mobs || []).map(m => m.id)
        t.MobTypes = allIds.filter(x => x.toLowerCase() !== low)
        return
      }
      const cur = new Set(t.MobTypes.map(x => x.toLowerCase()))
      if (cur.has(low)) {
        t.MobTypes = Array.from(cur).filter(x => x !== low)
      } else {
        t.MobTypes = Array.from(new Set([...cur, id]))
      }
    })
  }

  const toggleAll = () => {
    if (isAll) {
      // Deselect all -> empty list
      apply(t => { t.MobTypes = [] })
    } else {
      // Select all -> explicit list of the mobs shown on this page (no asterisk)
      const allIds = (mobs || []).map(m => m.id)
      apply(t => { t.MobTypes = allIds })
    }
  }

  return (
    <section className="card">
      <div className="section-header">
        <h3>Eligible Pets: {(!isAll && selected.size === 0) ? 'None' : (isStarAll ? 'All (*)' : 'Selected')}</h3>
      </div>

      <div className="field span-2" style={{ marginBottom: 12, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <button className="btn" onClick={toggleAll} title={isAll ? 'Deselect all mobs (none).' : 'Select all listed mobs.'}>
          {isAll ? 'Deselect All' : 'Select All'}
        </button>
        {mobs && isAll && (
          <label style={{ display: 'inline-flex', gap: 8, alignItems: 'center', marginLeft: 8 }}>
            <input
              type="checkbox"
              checked={isStarAll}
              onChange={e => {
                const checked = e.currentTarget.checked
                if (checked) {
                  // Switch to star (include future updates)
                  apply(t => { t.MobTypes = ['*'] })
                } else {
                  // Switch to explicit list (listed mobs only)
                  const allIds = (mobs || []).map(m => m.id)
                  apply(t => { t.MobTypes = allIds })
                }
              }}
            />
            Include mobs from future Minecraft updates
          </label>
        )}
      </div>
      <div className="field span-2" style={{ marginTop: -8, marginBottom: 8 }}>
        {(() => {
          const none = !isAll && selected.size === 0
          const show = isStarAll || none
          if (!show) return null
          return (
            <Notice variant={isStarAll ? 'warning' : 'error'}>
              {isStarAll ? 'All Pets listed here, including Pets from future updates, will be eligible for this Skill.' : 'No Pets will be eligible for this Skill.'}
            </Notice>
          )
        })()}
      </div>

      <div className="form-grid">
        <div className="field span-2">
          <label className="label">Click to toggle eligible mobs</label>
          {error && <Notice variant="error" compact style={{ marginBottom: 8 }}>{error}</Notice>}
          {!mobs && <div>Loading latest Minecraft entities…</div>}
          {mobs && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 8 }}>
              {mobs.map(m => {
                const active = isAll || selected.has(m.id.toLowerCase())
                return (
                  <button
                    key={m.id}
                    type="button"
                    className="btn"
                    onClick={() => toggle(m.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      justifyContent: 'flex-start',
                      background: active ? '#e8fff0' : undefined,
                      color: active ? '#165' : undefined,
                      borderColor: active ? '#8eb' : undefined,
                      boxShadow: active ? 'inset 0 0 0 1px rgba(0,0,0,0.06)' : undefined,
                    }}
                    title={m.label}
                  >
                    <ItemIcon id={m.egg} alt={`${m.label} Spawn Egg`} />
                    <span style={active ? { fontWeight: 600, textShadow: '0 1px 1px rgba(0,0,0,0.35)' } : undefined}>{m.label}</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
