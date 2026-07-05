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
  useValidation.ts — React hooks for consuming validation state.

  Provides memoized validation results that automatically update when
  the store changes. Components should use these hooks instead of
  calling validator functions directly for optimal performance.
*/

import { useMemo } from 'react'
import { useStore } from '../../state/store'
import {
    validateTree,
    validateAllTrees,
    hasErrors,
    type TreeValidation,
    type TabName
} from './validator'

/**
 * Hook to get validation state for a specific tree.
 * Returns memoized validation results that update when the tree changes.
 */
export function useTreeValidation(treeId: string | undefined) {
    const tree = useStore(s => s.trees.find(t => t.ID === treeId))

    return useMemo(() => {
        if (!tree) {
            return {
                validation: undefined as TreeValidation | undefined,
                hasErrors: false,
                skillErrors: new Map<string, string[]>(),
                tabErrors: {
                    properties: false,
                    appearance: false,
                    eligible: false,
                    requirements: false,
                    notifications: false,
                    skills: false
                } as Record<TabName, boolean>
            }
        }

        const validation = validateTree(tree)

        // Build a map of skillId -> error messages for easy lookup
        const skillErrors = new Map<string, string[]>()
        for (const skill of validation.skills) {
            if (skill.errors.length > 0) {
                skillErrors.set(skill.skillId, skill.errors.map(e => e.message))
            }
        }

        return {
            validation,
            hasErrors: hasErrors(validation),
            skillErrors,
            tabErrors: validation.tabs
        }
    }, [tree])
}

/**
 * Hook to get validation state for all trees.
 * Returns a map of tree ID -> has errors, plus total error count.
 */
export function useAllTreesValidation() {
    const trees = useStore(s => s.trees)

    return useMemo(() => {
        const validations = validateAllTrees(trees)

        // Map of treeId -> boolean (has errors)
        const treeErrors = new Map<string, boolean>()
        let errorCount = 0

        for (const v of validations) {
            const hasErr = hasErrors(v)
            treeErrors.set(v.treeId, hasErr)
            if (hasErr) errorCount++
        }

        return {
            validations,
            treeErrors,
            errorCount,
            hasAnyErrors: errorCount > 0
        }
    }, [trees])
}