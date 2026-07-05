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
  i18n/resources/index.ts — Resource loader for bundled translations.

  Responsibilities:
  - Load and export bundled English resources
  - Provide typed access to translation bundles
*/

import type { Resource } from 'i18next'
import commonEn from './en/common.json'
import skillsEn from './en/skills.json'
import validationEn from './en/validation.json'
import type { Resources } from '../types'

/** Bundled English resources (always available, used as fallback) */
export const bundledResources: Resource = {
  en: {
    common: commonEn,
    skills: skillsEn,
    validation: validationEn,
  },
}

/** Typed accessor for bundled resources */
export const typedBundledResources: Record<string, Resources> = {
  en: {
    common: commonEn,
    skills: skillsEn,
    validation: validationEn,
  },
}

/**
 * Get bundled resources for a language.
 * Only English is bundled; returns null for other languages.
 */
export function getBundledResources(lang: string): Resources | null {
  return typedBundledResources[lang] ?? null
}

/**
 * Get English resources (always available as ultimate fallback).
 */
export function getEnglishResources(): Resources {
  return typedBundledResources.en
}
