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
  i18n/services/ResourceManager.ts — Translation resource orchestrator.

  Responsibilities:
  - Coordinate between bundled and OTA resources
  - Implement fallback strategy: OTA → cache → bundled → English
  - Provide loading methods for i18next integration
*/

import { i18n } from '../config'
import { getBundledResources, getEnglishResources } from '../resources'
import { CrowdinOTA } from './CrowdinOTA'
import type { Resources } from '../types'

/** Recursively count all leaf string values in a nested object (translation keys) */
function countTranslationStrings(obj: Record<string, unknown>): number {
  let count = 0
  for (const value of Object.values(obj)) {
    if (typeof value === 'string') {
      count++
    } else if (value && typeof value === 'object') {
      count += countTranslationStrings(value as Record<string, unknown>)
    }
  }
  return count
}

/**
 * ResourceManager orchestrates loading translations from various sources.
 * Follows the pattern: OTA → localStorage cache → bundled → English fallback
 */
export class ResourceManager {
  /**
   * Get resources for a language with full fallback strategy.
   *
   * For English: Returns bundled resources immediately
   * For others: Tries OTA → cache → bundled → English
   */
  static async getResources(lang: string): Promise<Resources> {
    // English is always bundled
    if (lang === 'en') {
      return getEnglishResources()
    }

    // Try OTA (includes cache check)
    const otaResources = await CrowdinOTA.loadLanguage(lang)
    if (otaResources) {
      return otaResources
    }

    // Try bundled (for pre-bundled languages if we add more later)
    const bundled = getBundledResources(lang)
    if (bundled) {
      return bundled
    }

    // Ultimate fallback: English
    if (import.meta.env.DEV) {
      console.warn(`[i18n] No translations found for ${lang}, falling back to English`)
    }
    return getEnglishResources()
  }

  /**
   * Load a language and add resources to i18next.
   * Returns true if resources were loaded successfully.
   */
  static async loadLanguageIntoI18n(lang: string): Promise<boolean> {
    try {
      const resources = await this.getResources(lang)

      // Add resource bundles to i18next
      i18n.addResourceBundle(lang, 'common', resources.common, true, true)
      i18n.addResourceBundle(lang, 'skills', resources.skills, true, true)
      i18n.addResourceBundle(lang, 'validation', resources.validation, true, true)

      if (import.meta.env.DEV) {
        const totalStrings =
          countTranslationStrings(resources.common) +
          countTranslationStrings(resources.skills) +
          countTranslationStrings(resources.validation)
        console.debug(`[i18n] Loaded language '${lang}' with ${totalStrings} translation strings`)
      }

      return true
    } catch (error) {
      console.error(`[i18n] Failed to load resources for ${lang}:`, error)
      return false
    }
  }

  /**
   * Preload a language in the background (non-blocking).
   * Useful for preloading the user's preferred language on app start.
   */
  static preload(lang: string): void {
    if (lang === 'en') return // Already bundled

    this.loadLanguageIntoI18n(lang).catch((error) => {
      console.warn(`[i18n] Preload failed for ${lang}:`, error)
    })
  }
}
