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

import React, { useEffect, useState } from 'react'

export type LevelSelection =
    | { type: 'fixed'; levels: number[] }
    | { type: 'dynamic'; every: number; start?: number; until?: number }

export default function LevelModal({
    open,
    onCancel,
    onSubmit,
    initial,
    title = 'Select Levels',
}: {
    open: boolean
    onCancel: () => void
    onSubmit: (sel: LevelSelection) => void
    initial?: LevelSelection
    title?: string
}) {
    const [tab, setTab] = useState<'fixed' | 'dynamic'>('fixed')

    // Fixed
    const [levelsText, setLevelsText] = useState('')

    // Dynamic
    const [every, setEvery] = useState<number>(1)
    const [start, setStart] = useState<number | ''>('')
    const [until, setUntil] = useState<number | ''>('')

    // Pre-fill fields when opening with an initial value
    useEffect(() => {
        if (!open) return
        if (!initial) {
            // Reset to defaults when opening without initial
            setTab('fixed')
            setLevelsText('')
            setEvery(1)
            setStart('')
            setUntil('')
            return
        }
        if (initial.type === 'fixed') {
            setTab('fixed')
            setLevelsText(initial.levels.join(' '))
        } else {
            setTab('dynamic')
            setEvery(initial.every)
            setStart(typeof initial.start === 'number' ? initial.start : '')
            setUntil(typeof initial.until === 'number' ? initial.until : '')
        }
    }, [open, initial])

    if (!open) return null

    const submit = () => {
        if (tab === 'fixed') {
            const nums = levelsText
                .split(/[,\s]+/)
                .map(s => s.trim())
                .filter(Boolean)
                .map(n => Number(n))
            const valid = nums.filter(n => Number.isFinite(n) && n > 0)
            if (valid.length === 0) return onCancel()
            onSubmit({ type: 'fixed', levels: valid as number[] })
        } else {
            const n = Number(every)
            if (!Number.isFinite(n) || n <= 0) return onCancel()
            const s = start === '' ? undefined : Number(start)
            const u = until === '' ? undefined : Number(until)
            onSubmit({ type: 'dynamic', every: n, start: s, until: u })
        }
    }

    return (
        <div className="modal-backdrop" onClick={onCancel}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <h3>{title}</h3>

                <div style={{ display: 'flex', gap: 8, marginTop: 8, marginBottom: 12 }}>
                    <button
                        className="btn"
                        onClick={() => setTab('fixed')}
                        aria-pressed={tab === 'fixed'}
                        style={{ fontWeight: tab === 'fixed' ? 700 : 500 }}
                    >
                        Fixed
                    </button>
                    <button
                        className="btn"
                        onClick={() => setTab('dynamic')}
                        aria-pressed={tab === 'dynamic'}
                        style={{ fontWeight: tab === 'dynamic' ? 700 : 500 }}
                    >
                        Dynamic
                    </button>
                </div>

                {tab === 'fixed' ? (
                    <div>
                        <label style={{ display: 'grid', gap: 6 }}>
                            <span className="muted">Enter one or more levels (space/comma separated)</span>
                            <input
                                autoFocus
                                className="input"
                                placeholder="e.g. 1 3 5 or 1,3,5"
                                value={levelsText}
                                onChange={e => setLevelsText(e.target.value)}
                                style={{ width: '100%' }}
                            />
                        </label>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: 12 }}>
                        <label style={{ display: 'grid', gap: 6 }}>
                            <span>Every (required)</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <input
                                    type="number"
                                    min={1}
                                    className="input"
                                    value={every}
                                    onChange={e => setEvery(Math.max(1, Number(e.target.value)))}
                                    style={{ width: 140 }}
                                />
                                <span className="muted">levels</span>
                            </div>
                        </label>
                        <label style={{ display: 'grid', gap: 6 }}>
                            <span>Start from level (optional)</span>
                            <input
                                type="number"
                                min={1}
                                className="input"
                                value={start}
                                onChange={e => setStart(e.target.value === '' ? '' : Math.max(1, Number(e.target.value)))}
                                style={{ width: 200 }}
                            />
                        </label>
                        <label style={{ display: 'grid', gap: 6 }}>
                            <span>Until level (optional)</span>
                            <input
                                type="number"
                                min={1}
                                className="input"
                                value={until}
                                onChange={e => setUntil(e.target.value === '' ? '' : Math.max(1, Number(e.target.value)))}
                                style={{ width: 200 }}
                            />
                        </label>
                    </div>
                )}

                <div className="modal-actions">
                    <button className="btn" onClick={onCancel}>Cancel</button>
                    <button className="btn primary" onClick={submit}>Done</button>
                </div>
            </div>
        </div>
    )
}
