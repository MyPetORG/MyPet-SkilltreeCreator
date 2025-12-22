/*
 * SPDX-License-Identifier: AGPL-3.0-only
 * Copyright (c) 2025 UserDerezzed
 *
 * This file is part of MyPet-SkilltreeCreator.
 */

import React, { useState } from 'react'
import type { SumWithBreakdown } from '../../skills/core/utils'

interface Props {
    data: SumWithBreakdown
    suffix?: string  // e.g., "%" for percentage fields
}

/**
 * Displays a cumulative total with a hover tooltip showing the breakdown.
 */
export default function TotalWithBreakdown({ data, suffix = '' }: Props) {
    const [showTooltip, setShowTooltip] = useState(false)
    const { total, breakdown } = data

    const formatNum = (n: number) => (n >= 0 ? `+${n}` : String(n)) + suffix

    // Show breakdown when multiple upgrades contribute OR a single upgrade triggers multiple times
    const hasUsefulBreakdown = breakdown.length > 1 || breakdown.some(item => item.triggerCount > 1)

    return (
        <span
            style={{
                fontSize: 12,
                color: 'var(--text-muted, #888)',
                position: 'relative',
            }}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
        >
            (Total: {formatNum(total)})
            {showTooltip && hasUsefulBreakdown && (
                <div
                    style={{
                        position: 'absolute',
                        bottom: '100%',
                        left: 0,
                        marginBottom: 6,
                        background: 'var(--bg-tooltip, #222)',
                        color: 'var(--text-tooltip, #eee)',
                        padding: '8px 12px',
                        borderRadius: 6,
                        fontSize: 12,
                        whiteSpace: 'nowrap',
                        zIndex: 1000,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                        minWidth: 180,
                    }}
                >
                    <div style={{ fontWeight: 600, marginBottom: 4, borderBottom: '1px solid var(--border-tooltip, #444)', paddingBottom: 4 }}>
                        Breakdown
                    </div>
                    {breakdown.map((item) => (
                        <div key={item.levelKey} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginTop: 2 }}>
                            <span style={{ opacity: 0.8 }}>
                                {item.levelLabel}
                                {item.triggerCount > 1 && <span style={{ opacity: 0.6 }}> ×{item.triggerCount}</span>}
                            </span>
                            <span style={{ fontFamily: 'monospace' }}>{formatNum(item.subtotal)}</span>
                        </div>
                    ))}
                    <div style={{ borderTop: '1px solid var(--border-tooltip, #444)', marginTop: 4, paddingTop: 4, fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                        <span>Total</span>
                        <span style={{ fontFamily: 'monospace' }}>{formatNum(total)}</span>
                    </div>
                </div>
            )}
        </span>
    )
}
