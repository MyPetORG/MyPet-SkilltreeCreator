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
  i18n/index.ts — Public API for internationalization.

  Re-exports all public types, functions, and configuration.
*/

export { initI18n, i18n, saveLanguagePreference, getLanguagePreference } from './config'
export { DEFAULT_LANGUAGE, NAMESPACES, getLanguageInfo } from './types'
export type { Namespace, LanguageInfo, Resources } from './types'
export { getBundledResources, getEnglishResources } from './resources'
export { CrowdinOTA, ResourceManager } from './services'
