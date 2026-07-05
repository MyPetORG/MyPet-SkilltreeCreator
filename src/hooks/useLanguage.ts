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
  hooks/useLanguage.ts — Language preference hook with persistence.

  Responsibilities:
  - Expose current language and setter function
  - Handle async language loading from Crowdin OTA
  - Persist language preference to localStorage
  - Provide loading state during language switch

  Pattern mirrors useTheme.ts for consistency.
*/

import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { saveLanguagePreference } from '../i18n'
import { ResourceManager } from '../i18n/services'

/**
 * Hook for managing language preference.
 *
 * @returns Object with language, setLanguage function, and loading state
 *
 * @example
 * const { language, setLanguage, isLoading } = useLanguage()
 *
 * // Change language
 * await setLanguage('es')
 */
export function useLanguage() {
  const { i18n } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)

  // Get current language, defaulting to 'en' if not set
  const language = i18n.language || 'en'

  const setLanguage = useCallback(async (lang: string) => {
    if (lang === language) return

    setIsLoading(true)
    try {
      // Load resources if not English (English is bundled)
      if (lang !== 'en') {
        await ResourceManager.loadLanguageIntoI18n(lang)
      }

      // Change language in i18next
      await i18n.changeLanguage(lang)

      // Persist preference
      saveLanguagePreference(lang)
    } catch (error) {
      console.error('[useLanguage] Failed to change language:', error)
    } finally {
      setIsLoading(false)
    }
  }, [i18n, language])

  return { language, setLanguage, isLoading }
}
