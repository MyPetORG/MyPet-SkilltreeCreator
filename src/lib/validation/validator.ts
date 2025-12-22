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
  validator.ts — Centralized validation service for skilltrees.

  Responsibilities:
  - Single source of truth for all validation logic
  - Validates skills against Zod schemas from SKILL_REGISTRY
  - Enforces cumulative skill rules (first upgrade must have at least one field)
  - Provides typed validation results for UI consumption
  - Extensible for future tab validators
*/

import { SKILL_REGISTRY } from '../../skills/core/registry'
import type { SkilltreeFile } from '../types'

/** Cumulative skills require at least one field in the first upgrade */
export const CUMULATIVE_SKILLS: ReadonlySet<string> = new Set([
    'Thorns', 'Wither', 'Stomp', 'Slow', 'Shield', 'Ride', 'Arrow', 'Poison',
    'Pickup', 'Lightning', 'Fire', 'Beacon', 'Damage', 'Heal', 'Knockback',
    'Life', 'Backpack'
])

/** A single validation error with path and message */
export type ValidationError = {
    /** Path format: "treeId/skillId/level" or "treeId/tab/field" */
    path: string
    /** Human-readable error message */
    message: string
}

/** Validation result for a single skill */
export type SkillValidation = {
    skillId: string
    errors: ValidationError[]
}

/** Tab names that can have validation */
export type TabName = 'properties' | 'appearance' | 'eligible' | 'requirements' | 'notifications' | 'skills'

/** Complete validation result for a tree */
export type TreeValidation = {
    treeId: string
    skills: SkillValidation[]
    /** Which tabs have errors - extensible for future validators */
    tabs: Record<TabName, boolean>
    /** All errors flattened for easy iteration */
    allErrors: ValidationError[]
}

/**
 * Validates a single skill within a tree.
 * Checks both Zod schema validation and cumulative skill rules.
 */
export function validateSkill(tree: SkilltreeFile, skillId: string): SkillValidation {
    const errors: ValidationError[] = []
    const skillDef = SKILL_REGISTRY.get(skillId)

    if (!skillDef) {
        errors.push({
            path: `${tree.ID}/${skillId}`,
            message: `Unknown skill: ${skillId}`
        })
        return { skillId, errors }
    }

    const skillData = tree.Skills?.[skillId]
    const upgrades = skillData?.Upgrades ?? {}
    const upgradeEntries = Object.entries(upgrades)

    // Skills must have at least one upgrade to be valid
    if (upgradeEntries.length === 0) {
        errors.push({
            path: `${tree.ID}/${skillId}`,
            message: 'Skill must have at least one upgrade'
        })
        return { skillId, errors }
    }

    const firstKey = upgradeEntries[0]?.[0]

    for (const [level, payload] of upgradeEntries) {
        // Zod schema validation
        const result = skillDef.schema.safeParse(payload)
        if (!result.success) {
            const messages = result.error.errors.map(e => e.message).join(', ')
            errors.push({
                path: `${tree.ID}/${skillId}/${level}`,
                message: messages
            })
            continue
        }

        // Cumulative skill rule: first upgrade must have at least one non-empty field
        if (CUMULATIVE_SKILLS.has(skillId) && level === firstKey) {
            const values = payload ?? {}
            const hasAnyField = Object.values(values).some(val =>
                typeof val === 'string' ? val.trim() !== '' : Boolean(val)
            )
            if (!hasAnyField) {
                errors.push({
                    path: `${tree.ID}/${skillId}/${level}`,
                    message: 'At least one field must be provided for the first level'
                })
            }
        }
    }

    return { skillId, errors }
}

/**
 * Validates an entire skilltree.
 * Returns structured validation result with per-skill and per-tab breakdown.
 */
export function validateTree(tree: SkilltreeFile): TreeValidation {
    const skills: SkillValidation[] = []
    const allErrors: ValidationError[] = []

    // Validate all skills
    for (const skillId of Object.keys(tree.Skills ?? {})) {
        const skillValidation = validateSkill(tree, skillId)
        skills.push(skillValidation)
        allErrors.push(...skillValidation.errors)
    }

    // Determine which tabs have errors
    // Currently only 'skills' tab has validation, but infrastructure is ready for future tabs
    const hasSkillErrors = skills.some(s => s.errors.length > 0)

    const tabs: Record<TabName, boolean> = {
        properties: false,      // Future: validate ID, weight, etc.
        appearance: false,      // Future: validate name, icon, etc.
        eligible: false,        // Future: validate mob types
        requirements: false,    // Future: validate level bounds, permissions
        notifications: false,   // Future: validate notification format
        skills: hasSkillErrors
    }

    return {
        treeId: tree.ID,
        skills,
        tabs,
        allErrors
    }
}

/**
 * Validates all trees and returns array of validation results.
 */
export function validateAllTrees(trees: SkilltreeFile[]): TreeValidation[] {
    return trees.map(tree => validateTree(tree))
}

/**
 * Checks if a tree validation result has any errors.
 */
export function hasErrors(validation: TreeValidation): boolean {
    return validation.allErrors.length > 0
}

/**
 * Gets a Set of skill IDs that have validation errors in a tree.
 */
export function getInvalidSkillIds(tree: SkilltreeFile): Set<string> {
    const validation = validateTree(tree)
    return new Set(
        validation.skills
            .filter(s => s.errors.length > 0)
            .map(s => s.skillId)
    )
}