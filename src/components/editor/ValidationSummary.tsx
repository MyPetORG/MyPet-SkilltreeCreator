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
  ValidationSummary.tsx — Aggregates schema validation across all trees.

  Modes
  - full: renders a bullet list of validation messages or a success line.
  - icon: renders a compact emoji indicator with an accessible title.

  It walks through every tree/skill/upgrade and validates the payload against
  the corresponding zod schema in SKILL_REGISTRY.
*/
import React from 'react'
import {useStore} from '../../state/store'
import {SKILL_REGISTRY} from '../../skills/core/registry'

/** Props controlling the layout of the summary. */
type Props = {
    mode?: 'full' | 'icon'
}

/** ValidationSummary — cross-tree validator with full or icon display. */
export default function ValidationSummary({ mode = 'full' }: Props) {
    const trees = useStore(s => s.trees)
    const allErrors: string[] = []

    for (const t of trees) {
        for (const [skillId, sdef] of Object.entries(t.Skills ?? {})) {
            const reg = SKILL_REGISTRY.get(skillId)
            if (!reg) continue
            for (const [lvl, val] of Object.entries(sdef.Upgrades ?? {})) {
                const res = reg.schema.safeParse(val)
                if (!res.success) {
                    const msg = res.error.errors.map((e: { message: any }) => e.message).join(', ')
                    allErrors.push(`${t.ID}/${skillId}/${lvl}: ${msg}`)
                }
            }
        }
    }

    if (mode === 'icon') {
        const ok = allErrors.length === 0
        const title = ok ? 'All skilltrees valid' : `${allErrors.length} validation issue${allErrors.length > 1 ? 's' : ''} found`
        return (
            <span
                className="validation-indicator"
                title={title}
                aria-label={title}
                role="img"
                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 22, height: 22, fontSize: 18 }}
            >{ok ? '✅' : '✖️'}</span>
        )
    }

    if (allErrors.length === 0)
        return <div className="validation-ok">✅ All skilltrees valid.</div>

    return (
        <div className="validation-error">
            ⚠ {allErrors.length} validation issue{allErrors.length > 1 ? 's' : ''} found:
            <ul>
                {allErrors.map((e, i) => <li key={i}>{e}</li>)}
            </ul>
        </div>
    )
}