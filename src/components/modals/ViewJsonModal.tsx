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

import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAlert } from './AlertModal'
import type { SkilltreeFile } from '../../lib/types'

export type ViewJsonModalProps = {
  isOpen: boolean
  onClose: () => void
  tree: SkilltreeFile
}

export default function ViewJsonModal({ isOpen, onClose, tree }: ViewJsonModalProps) {
  const { t } = useTranslation()
  const alert = useAlert()

  if (!isOpen) return null

  const json = JSON.stringify(tree, null, 2)

  async function copyJson() {
    try {
      await navigator.clipboard.writeText(json)
      await alert(t('modals.alert.jsonCopied'))
    } catch (e) {
      console.error(e)
      await alert(t('modals.alert.jsonCopyFailed'))
    }
  }

  function downloadJson() {
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${tree.ID || 'skilltree'}.st.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h3>{t('appearance.viewJson')}</h3>
        <p className="muted" style={{ marginTop: 4 }}>{t('appearance.jsonPreview')}</p>

        <div style={{ marginTop: 12, maxHeight: '50vh', overflow: 'auto', border: '1px solid var(--line)', borderRadius: 8, padding: 12, background: 'var(--panel)' }}>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {json}
          </pre>
        </div>

        <div className="modal-actions">
          <button className="btn" onClick={copyJson}>{t('actions.copyJson')}</button>
          <button className="btn" onClick={downloadJson}>{t('actions.download')}</button>
          <button className="btn primary" onClick={onClose}>{t('actions.close')}</button>
        </div>
      </div>
    </div>
  )
}
