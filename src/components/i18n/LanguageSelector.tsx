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
  LanguageSelector.tsx — Language dropdown for topbar.

  Responsibilities:
  - Display current language with flag
  - Fetch available languages dynamically from Crowdin OTA
  - Show dropdown with all available languages
  - Handle language switching with loading state
  - Close dropdown on outside click

  Styled to match ThemeToggle pattern.
*/

import React, { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../../hooks/useLanguage'
import { getLanguageInfo, CrowdinOTA } from '../../i18n'

export default function LanguageSelector() {
  const { t } = useTranslation()
  const { language, setLanguage, isLoading: isChangingLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [availableLanguages, setAvailableLanguages] = useState<string[]>(['en'])
  const [isLoadingLanguages, setIsLoadingLanguages] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Fetch available languages on first open
  useEffect(() => {
    if (!isOpen) return
    if (availableLanguages.length > 1) return // Already fetched

    setIsLoadingLanguages(true)
    CrowdinOTA.getAvailableLanguages()
      .then(setAvailableLanguages)
      .finally(() => setIsLoadingLanguages(false))
  }, [isOpen, availableLanguages.length])

  // Close dropdown on outside click
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  // Close dropdown on Escape key
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  const handleSelect = async (lang: string) => {
    setIsOpen(false)
    if (lang !== language) {
      await setLanguage(lang)
    }
  }

  const currentLangInfo = getLanguageInfo(language)

  return (
    <div ref={ref} className="language-selector-container">
      <button
        className="btn btn--icon language-selector-btn"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isChangingLanguage}
        title={currentLangInfo.nativeName}
        aria-label={t('language.select')}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        {isChangingLanguage ? (
          <span className="language-selector-loading">...</span>
        ) : (
          <span className="language-selector-code">
            {language.toUpperCase()}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="language-selector-dropdown" role="listbox">
          {isLoadingLanguages ? (
            <div className="language-selector-loading-list">
              {t('language.loading')}
            </div>
          ) : (
            availableLanguages.map((lang) => {
              const info = getLanguageInfo(lang)
              const isSelected = lang === language
              return (
                <button
                  key={lang}
                  className={`language-selector-option ${isSelected ? 'is-selected' : ''}`}
                  onClick={() => handleSelect(lang)}
                  role="option"
                  aria-selected={isSelected}
                >
                  <span className="language-selector-option-name">
                    {info.nativeName}
                  </span>
                  {isSelected && (
                    <span className="language-selector-check" aria-hidden="true">✓</span>
                  )}
                </button>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}
