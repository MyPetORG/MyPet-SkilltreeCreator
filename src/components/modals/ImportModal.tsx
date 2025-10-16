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

import React, { useRef, useState } from 'react'
import JSZip from 'jszip'

type ImportModalProps = {
    isOpen: boolean
    onClose: () => void
    /** return parsed & validated trees to parent */
    onImported: (trees: any[]) => void
    /** validation function from parent (so we don’t duplicate logic) */
    validateTree: (t: any) => boolean
}

export default function ImportModal({ isOpen, onClose, onImported}: ImportModalProps) {
    const inputRef = useRef<HTMLInputElement>(null)
    const [busy, setBusy] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [dragOver, setDragOver] = useState(false)

    if (!isOpen) return null

    const accept = '.zip,.json,.st.json,application/json'

    async function handleFiles(files: FileList | null) {
        if (!files || !files.length) return
        setBusy(true)
        setError(null)
        const all: any[] = []

        try {
            for (const file of Array.from(files)) {
                if (file.name.toLowerCase().endsWith('.zip')) {
                    const zip = await JSZip.loadAsync(file)
                    const entries = Object.values(zip.files)
                    for (const entry of entries) {
                        if (entry.dir) continue
                        const name = entry.name.toLowerCase()
                        if (!(name.endsWith('.json') || name.endsWith('.st.json'))) continue
                        const content = await entry.async('string')
                        const data = JSON.parse(content)
                        const arr = Array.isArray(data) ? data : [data]
                        for (const t of arr) {
                            all.push(t)
                        }
                    }
                } else {
                    const text = await file.text()
                    const data = JSON.parse(text)
                    const arr = Array.isArray(data) ? data : [data]
                    for (const t of arr) {
                        all.push(t)
                    }
                }
            }

            onImported(all)
            onClose()
        } catch (e: any) {
            console.error(e)
            setError(e?.message || 'Failed to import file(s).')
        } finally {
            setBusy(false)
        }
    }

    function onDrop(e: React.DragEvent) {
        e.preventDefault()
        setDragOver(false)
        handleFiles(e.dataTransfer.files)
    }

    return (
        <div className="modal-backdrop" onClick={() => !busy && onClose()}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <h3>Import skilltrees</h3>
                <p className="muted" style={{marginTop: 4}}>
                    Drop a <b>.zip</b> (multiple trees) or a single <b>.st.json</b> file.
                </p>

                <div
                    className="dropzone"
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={onDrop}
                    data-dragover={dragOver || undefined}
                >
                    <div>
                        {busy ? 'Reading files…' : 'Drag & drop files here'}
                        <div className="muted" style={{marginTop: 4}}>or</div>
                        <button
                            className="btn"
                            onClick={() => inputRef.current?.click()}
                            disabled={busy}
                            style={{marginTop: 8}}
                        >
                            Choose files
                        </button>
                    </div>
                    <input
                        ref={inputRef}
                        type="file"
                        accept={accept}
                        multiple
                        style={{ display: 'none' }}
                        onChange={(e) => handleFiles(e.currentTarget.files)}
                    />
                </div>

                {error && <div className="validation-error" style={{marginTop: 12}}>{error}</div>}

                <div className="modal-actions">
                    <button className="btn" onClick={onClose} disabled={busy}>Cancel</button>
                </div>
            </div>
        </div>
    )
}