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
import type { SkilltreeFile } from '../../lib/types'

export type ViewJsonModalProps = {
  isOpen: boolean
  onClose: () => void
  tree: SkilltreeFile
}

export default function ViewJsonModal({ isOpen, onClose, tree }: ViewJsonModalProps) {
  if (!isOpen) return null

  const json = JSON.stringify(tree, null, 2)

  async function copyJson() {
    try {
      await navigator.clipboard.writeText(json)
      // very lightweight feedback
      alert('JSON copied to clipboard')
    } catch (e) {
      console.error(e)
      alert('Failed to copy JSON')
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
        <h3>Skilltree JSON</h3>
        <p className="muted" style={{ marginTop: 4 }}>Preview of the selected skilltree as JSON.</p>

        <div style={{ marginTop: 12, maxHeight: '50vh', overflow: 'auto', border: '1px solid var(--line)', borderRadius: 8, padding: 12, background: 'var(--panel)' }}>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {json}
          </pre>
        </div>

        <div className="modal-actions">
          <button className="btn" onClick={copyJson}>Copy JSON</button>
          <button className="btn" onClick={downloadJson}>Download</button>
          <button className="btn primary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}
