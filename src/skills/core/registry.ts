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
  skills/core/registry.ts — Dynamic registry of available skill editors.

  This file eagerly imports all TSX files one level up (../*.tsx) and collects
  any exported `skillDef` objects into a runtime Map keyed by skill id.

  Consumers (e.g., SkillsPanel, SkillEditor) use SKILL_REGISTRY to render the
  proper schema and editor UI for each skill present in a tree.
*/
import type {SkillDefinition} from './core/contracts'

// Grab all files that export `skillDef`
const modules = import.meta.glob('../*.tsx', {eager: true}) as Record<
    string,
    { skillDef?: SkillDefinition<string> }
>

const map = new Map<string, SkillDefinition<string>>()
for (const m of Object.values(modules)) {
    if (m.skillDef) map.set(m.skillDef.id, m.skillDef)
}

/** Runtime registry of skill definitions (schema + editor) by id. */
export const SKILL_REGISTRY = map

// Types derived from the registry (name will be `string`, but that’s OK)
export type SkillName = string
export type SkillDefinitionAny = SkillDefinition<string>
