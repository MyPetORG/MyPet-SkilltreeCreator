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
  main.tsx — Application bootstrap entry for Vite/React.

  - Sets up HashRouter for client-side navigation (no server config needed).
  - Imports global CSS.
  - Initializes i18n before rendering.
  - Preloads lightweight external minecraft-data (effects, mobs) in the background
    via McData.preloadAll(), without blocking initial render.
*/
import React from 'react'
import ReactDOM from 'react-dom/client'
import {HashRouter} from 'react-router-dom'
import App from './App'
import '../styles/index.css'
import '../styles/minecraft-text.css'
import { McData } from '../lib/mcAssets'
import { initI18n, i18n, ResourceManager } from '../i18n'

// Bootstrap function to initialize i18n before rendering
async function bootstrap() {
    // Initialize i18next (synchronous for English, which is bundled)
    await initI18n()

    // Load current language translations before rendering (blocks render)
    const currentLang = i18n.language
    if (currentLang && currentLang !== 'en') {
        await ResourceManager.loadLanguageIntoI18n(currentLang)
    }

    // Kick off preloading of minecraft-data (effects, mobs) on page load
    // Fire-and-forget; does not block UI rendering
    void McData.preloadAll()

    const rootElement = document.getElementById('root')
    if (!rootElement) {
        throw new Error('No root element found!')
    }

    ReactDOM.createRoot(rootElement).render(
        <React.StrictMode>
            <HashRouter>
                <App/>
            </HashRouter>
        </React.StrictMode>
    )
}

bootstrap().catch(console.error)