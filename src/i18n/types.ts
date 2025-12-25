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
  i18n/types.ts — TypeScript declarations for type-safe translation keys.

  Responsibilities:
  - Define supported languages with metadata
  - Type augmentation for i18next to enable autocomplete
  - Resource type definitions for translation bundles
*/

import type common from './resources/en/common.json'
import type skills from './resources/en/skills.json'
import type validation from './resources/en/validation.json'

/** Default/fallback language - always available */
export const DEFAULT_LANGUAGE = 'en'

export const NAMESPACES = ['common', 'skills', 'validation'] as const
export type Namespace = typeof NAMESPACES[number]

/** Language metadata for UI display */
export interface LanguageInfo {
  code: string
  name: string
  nativeName: string
}

/**
 * Get language info for a language code using browser's Intl API.
 * No hardcoded language list - names are derived dynamically.
 */
export function getLanguageInfo(code: string): LanguageInfo {
  // Get language name in English
  let name = code
  try {
    const englishNames = new Intl.DisplayNames(['en'], { type: 'language' })
    name = englishNames.of(code) ?? code
  } catch {
    // Fallback to code if Intl fails
  }

  // Get language name in its own language (native name)
  let nativeName = code
  try {
    const nativeNames = new Intl.DisplayNames([code], { type: 'language' })
    nativeName = nativeNames.of(code) ?? code
  } catch {
    // Fallback to English name or code
    nativeName = name
  }

  return { code, name, nativeName }
}

/** Resource bundle structure */
export interface Resources {
  common: Record<string, unknown>
  skills: Record<string, unknown>
  validation: Record<string, unknown>
}

/**
 * Type augmentation for i18next to enable type-safe translation keys.
 * This allows autocomplete and compile-time checking of translation keys.
 */1
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common'
    resources: {
      common: typeof common
      skills: typeof skills
      validation: typeof validation
    }
  }
}
