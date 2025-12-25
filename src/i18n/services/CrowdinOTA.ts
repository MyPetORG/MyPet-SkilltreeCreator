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
  i18n/services/CrowdinOTA.ts — Crowdin Over-The-Air translation fetcher.

  Responsibilities:
  - Fetch translations from Crowdin OTA CDN
  - Cache translations to localStorage with TTL
  - Handle network failures gracefully
  - Provide cache invalidation utilities

  Pattern mirrors McData (src/lib/mcAssets.ts) with:
  - In-memory + localStorage caching
  - Defensive error handling (return null on failure)
  - Non-blocking operations
*/

import OtaClient from '@crowdin/ota-client'
import type { Resources } from '../types'

const CACHE_PREFIX = 'mypet-skilltree-creator/v1/i18n-cache/'
const LANGUAGES_CACHE_KEY = 'mypet-skilltree-creator/v1/i18n-languages'
const LANGUAGES_CACHE_TTL_MS = 60 * 60 * 1000 // 1 hour for language list

/**
 * Set a nested value in an object using dot-notation key.
 * Example: setNestedValue(obj, 'foo.bar.baz', 'value') sets obj.foo.bar.baz = 'value'
 */
function setNestedValue(obj: Record<string, unknown>, path: string, value: unknown): void {
  const parts = path.split('.')
  let current: Record<string, unknown> = obj
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i]
    if (!(part in current) || typeof current[part] !== 'object') {
      current[part] = {}
    }
    current = current[part] as Record<string, unknown>
  }
  current[parts[parts.length - 1]] = value
}
const CACHE_VERSION = 1
const CACHE_TTL_MS = 24 * 60 * 60 * 1000 // 24 hours

/** Structure of cached translation entry */
interface CacheEntry {
  version: number
  timestamp: number
  resources: Resources
}

/** Structure of cached languages entry */
interface LanguagesCacheEntry {
  version: number
  timestamp: number
  languages: string[]
}

/**
 * Crowdin OTA service for fetching and caching translations.
 * Uses static methods following the McData pattern.
 */
export class CrowdinOTA {
  private static client: OtaClient | null = null
  private static memoryCache = new Map<string, Resources>()
  private static languagesCache: string[] | null = null

  /**
   * Get or create Crowdin OTA client.
   * Returns null if no distribution hash is configured.
   */
  private static getClient(): OtaClient | null {
    if (this.client) return this.client

    const hash = import.meta.env.VITE_CROWDIN_DISTRIBUTION_HASH
    if (!hash) {
      return null
    }

    this.client = new OtaClient(hash)
    return this.client
  }

  /**
   * Fetch available languages from Crowdin OTA.
   * Uses in-memory cache → localStorage cache → network fetch.
   * Always includes 'en' as guaranteed fallback.
   */
  static async getAvailableLanguages(): Promise<string[]> {
    // Check memory cache first
    if (this.languagesCache) {
      return this.languagesCache
    }

    // Check localStorage cache
    const localCached = this.getLanguagesFromCache()
    if (localCached) {
      this.languagesCache = localCached
      return localCached
    }

    // Fetch from Crowdin OTA
    const client = this.getClient()
    if (!client) {
      // If not configured, only English is available
      return ['en']
    }

    try {
      const languages = await client.listLanguages()
      // Ensure 'en' is always included and first
      const langSet = new Set<string>(languages || [])
      langSet.add('en')
      const result: string[] = ['en', ...Array.from(langSet).filter(l => l !== 'en').sort()]

      // Cache the results
      this.saveLanguagesToCache(result)
      this.languagesCache = result

      if (import.meta.env.DEV) {
        console.log(`[i18n] Available languages from Crowdin:`, result)
      }

      return result
    } catch (error) {
      console.warn('[i18n] Failed to fetch languages from Crowdin:', error)

      // Try stale cache
      const staleCache = this.getLanguagesFromCache(true)
      if (staleCache) {
        this.languagesCache = staleCache
        return staleCache
      }

      // Fall back to English only
      return ['en']
    }
  }

  /**
   * Get languages from localStorage cache.
   */
  private static getLanguagesFromCache(ignoreExpiry = false): string[] | null {
    try {
      const stored = localStorage.getItem(LANGUAGES_CACHE_KEY)
      if (!stored) return null

      const entry: LanguagesCacheEntry = JSON.parse(stored)

      if (entry.version !== CACHE_VERSION) {
        localStorage.removeItem(LANGUAGES_CACHE_KEY)
        return null
      }

      if (!ignoreExpiry) {
        const age = Date.now() - entry.timestamp
        if (age > LANGUAGES_CACHE_TTL_MS) {
          return null
        }
      }

      return entry.languages
    } catch {
      return null
    }
  }

  /**
   * Save languages to localStorage cache.
   */
  private static saveLanguagesToCache(languages: string[]): void {
    try {
      const entry: LanguagesCacheEntry = {
        version: CACHE_VERSION,
        timestamp: Date.now(),
        languages,
      }
      localStorage.setItem(LANGUAGES_CACHE_KEY, JSON.stringify(entry))
    } catch {
      // Ignore errors
    }
  }

  /**
   * Load translations for a language from Crowdin OTA.
   * Uses in-memory cache → localStorage cache → network fetch.
   * Returns null on failure (caller should fall back to English).
   */
  static async loadLanguage(lang: string): Promise<Resources | null> {
    // Check memory cache first
    const memoryCached = this.memoryCache.get(lang)
    if (memoryCached) {
      return memoryCached
    }

    // Check localStorage cache
    const localCached = this.getFromCache(lang)
    if (localCached) {
      this.memoryCache.set(lang, localCached)
      return localCached
    }

    // Fetch from Crowdin OTA
    return this.fetchFromCrowdin(lang)
  }

  /**
   * Fetch translations from Crowdin OTA CDN.
   */
  private static async fetchFromCrowdin(lang: string): Promise<Resources | null> {
    const client = this.getClient()
    if (!client) {
      if (import.meta.env.DEV) {
        console.warn('[i18n] Crowdin OTA not configured (VITE_CROWDIN_DISTRIBUTION_HASH not set)')
      }
      return null
    }

    try {
      // Fetch all namespace files for this language
      // Note: The OTA client returns all strings; we filter by file pattern
      const strings = await client.getStringsByLocale(lang)

      // Parse strings into namespace buckets
      const common: Record<string, unknown> = {}
      const skills: Record<string, unknown> = {}
      const validation: Record<string, unknown> = {}

      // OTA returns flat key-value pairs; we reconstruct nested structure
      // For now, use a simpler approach: just return the strings as-is
      // and handle namespace separation at the file level
      Object.entries(strings || {}).forEach(([key, value]) => {
        if (key.startsWith('common.')) {
          const nestedKey = key.slice('common.'.length)
          setNestedValue(common, nestedKey, value)
        } else if (key.startsWith('skills.')) {
          const nestedKey = key.slice('skills.'.length)
          setNestedValue(skills, nestedKey, value)
        } else if (key.startsWith('validation.')) {
          const nestedKey = key.slice('validation.'.length)
          setNestedValue(validation, nestedKey, value)
        }
      })

      const resources: Resources = {
        common: common as Record<string, unknown>,
        skills: skills as Record<string, unknown>,
        validation: validation as Record<string, unknown>,
      }

      // Cache the results
      this.saveToCache(lang, resources)
      this.memoryCache.set(lang, resources)

      if (import.meta.env.DEV) {
        console.log(`[i18n] Loaded ${lang} translations from Crowdin OTA`)
      }

      return resources
    } catch (error) {
      console.warn(`[i18n] Failed to fetch ${lang} from Crowdin OTA:`, error)

      // Try to use stale cache as last resort
      const staleCache = this.getFromCache(lang, true)
      if (staleCache) {
        console.warn(`[i18n] Using stale cache for ${lang}`)
        this.memoryCache.set(lang, staleCache)
        return staleCache
      }

      return null
    }
  }

  /**
   * Get translations from localStorage cache.
   * Returns null if cache is missing, expired, or invalid.
   */
  private static getFromCache(lang: string, ignoreExpiry = false): Resources | null {
    try {
      const key = `${CACHE_PREFIX}${lang}`
      const stored = localStorage.getItem(key)
      if (!stored) return null

      const entry: CacheEntry = JSON.parse(stored)

      // Check version compatibility
      if (entry.version !== CACHE_VERSION) {
        this.clearCacheForLanguage(lang)
        return null
      }

      // Check expiry (unless ignoring for fallback)
      if (!ignoreExpiry) {
        const age = Date.now() - entry.timestamp
        if (age > CACHE_TTL_MS) {
          return null
        }
      }

      return entry.resources
    } catch {
      return null
    }
  }

  /**
   * Save translations to localStorage cache.
   */
  private static saveToCache(lang: string, resources: Resources): void {
    try {
      const key = `${CACHE_PREFIX}${lang}`
      const entry: CacheEntry = {
        version: CACHE_VERSION,
        timestamp: Date.now(),
        resources,
      }
      localStorage.setItem(key, JSON.stringify(entry))
    } catch (error) {
      console.warn('[i18n] Failed to cache translations:', error)
    }
  }

  /**
   * Clear cache for a specific language.
   */
  static clearCacheForLanguage(lang: string): void {
    try {
      localStorage.removeItem(`${CACHE_PREFIX}${lang}`)
      this.memoryCache.delete(lang)
    } catch {
      // Ignore errors
    }
  }

  /**
   * Clear all translation caches.
   */
  static clearAllCaches(): void {
    try {
      const keys = Object.keys(localStorage)
      for (const key of keys) {
        if (key.startsWith(CACHE_PREFIX)) {
          localStorage.removeItem(key)
        }
      }
      this.memoryCache.clear()
    } catch {
      // Ignore errors
    }
  }

  /**
   * Check if Crowdin OTA is configured.
   */
  static isConfigured(): boolean {
    return !!import.meta.env.VITE_CROWDIN_DISTRIBUTION_HASH
  }
}
