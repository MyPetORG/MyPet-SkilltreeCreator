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
  i18n/config.ts — i18next initialization and configuration.

  Responsibilities:
  - Initialize i18next with React bindings
  - Configure language detection (localStorage → browser → fallback)
  - Set up namespaces and fallback behavior
  - Provide missing key handler for development warnings
*/

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { bundledResources } from './resources'
import { DEFAULT_LANGUAGE, NAMESPACES } from './types'

const STORAGE_KEY = 'mypet-skilltree-creator/v1/language'

/**
 * Initialize i18next with configuration.
 * Call this once before rendering the app.
 */
export async function initI18n(): Promise<void> {
  await i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      // Bundled resources (English only, others loaded via Crowdin OTA)
      resources: bundledResources,

      // Fallback configuration - no supportedLngs, languages are dynamic from Crowdin
      fallbackLng: DEFAULT_LANGUAGE,
      load: 'languageOnly', // Use 'en' not 'en-US'
      nonExplicitSupportedLngs: true, // Allow any language, fallback to en if not loaded

      // Namespace configuration
      ns: [...NAMESPACES],
      defaultNS: 'common',

      // Language detection configuration
      detection: {
        order: ['localStorage', 'navigator'],
        caches: ['localStorage'],
        lookupLocalStorage: STORAGE_KEY,
      },

      // Interpolation (React escapes by default)
      interpolation: {
        escapeValue: false,
      },

      // React configuration
      react: {
        useSuspense: false, // Handle loading states manually
      },

      // Missing key handling (development only)
      saveMissing: false,
      missingKeyHandler: (_lngs: readonly string[], ns: string, key: string) => {
        if (import.meta.env.DEV) {
          console.warn(`[i18n] Missing translation key: [${ns}] ${key}`)
        }
      },

      // Debug mode in development
      debug: false, // Set to true for verbose logging
    })
}

/**
 * Save language preference to localStorage.
 */
export function saveLanguagePreference(lang: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, lang)
  } catch {
    // Ignore localStorage errors (e.g., Safari private mode)
  }
}

/**
 * Get current language preference from localStorage.
 */
export function getLanguagePreference(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    // Ignore localStorage errors
  }
  return null
}

export { i18n }
