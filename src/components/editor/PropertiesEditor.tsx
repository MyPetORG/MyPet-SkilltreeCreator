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
  PropertiesEditor.tsx — Edit core properties of a skilltree.

  Fields managed here:
  - ID: unique identifier used for export file names and references.
    • Renaming updates selection and is validated to avoid duplicates.
  - Inheritance: optionally inherit skills from another tree in the workspace.
  - Weight: balancing weight used by MyPet to prefer certain trees.

  Implementation notes
  - Mutations are performed via a local `apply` helper that clones the current
    tree, applies a mutation, and upserts it to global state. This integrates
    with autosave and preserves immutability.
*/
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useStore } from '../../state/store'
import type { SkilltreeFile } from '../../lib/types'
import { useAlert } from '../modals/AlertModal'

/** PropertiesEditor — main form for ID, inheritance, and weight. */
export default function PropertiesEditor() {
  const { t } = useTranslation()
  const alert = useAlert()
  const selectedId = useStore(s => s.selectedId)
  const tree = useStore(s => s.trees.find(tr => tr.ID === selectedId))
  const trees = useStore(s => s.trees)
  const upsertTree = useStore(s => s.upsertTree)

  if (!tree) return null

  const apply = (mutate: (tr: SkilltreeFile) => void) => {
    const next: SkilltreeFile = JSON.parse(JSON.stringify(tree))
    mutate(next)
    upsertTree(next)
  }

  const otherTrees = trees.filter(tr => tr.ID !== tree.ID)
  const inheritedId = tree.Inheritance?.Skilltree ?? ''

  return (
    <section className="card">
      <div className="section-header">
        <h3>{t('tabs.properties')}</h3>
      </div>

      <div className="form-grid">
        <div className="field">
          <label className="label">{t('properties.id')}</label>
          <input
            className="input"
            value={tree.ID}
            onChange={async (e) => {
              const newId = e.target.value
              const exists = trees.some(x => x.ID === newId && x.ID !== tree.ID)
              if (exists) {
                await alert(t('modals.alert.duplicateId'))
                return
              }
              apply(tr => {
                tr.ID = newId
              })
            }}
            placeholder={t('properties.idPlaceholder')}
          />
        </div>

        <div className="field">
          <label className="label">{t('properties.inheritance')}</label>
          <select
            className="input"
            value={inheritedId}
            onChange={e => {
              const v = e.currentTarget.value
              apply(tr => {
                tr.Inheritance = v ? { Skilltree: v } : undefined
              })
            }}
          >
            <option value="">{t('properties.inheritancePlaceholder')}</option>
            {otherTrees.map(tr => (
              <option key={tr.ID} value={tr.ID}>{tr.Name || tr.ID}</option>
            ))}
          </select>
        </div>

        <div className="field">
          <label className="label">{t('properties.weight')}</label>
          <input
            className="input"
            type="number"
            min={0}
            value={tree.Weight ?? ''}
            onChange={e => {
              const v = e.currentTarget.value
              apply(tr => { tr.Weight = v === '' ? undefined : Math.max(0, Number(v)) })
            }}
            placeholder={t('properties.weightPlaceholder')}
          />
        </div>
      </div>
    </section>
  )
}
