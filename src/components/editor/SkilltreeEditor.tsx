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
  SkilltreeEditor.tsx — Top-level editor shell for a single skilltree.

  UI Structure
  - Tabs switch between sub-editors: Properties, Appearance, Eligible Pets,
    Requirements, Notifications, and Skills.
  - Reads selection from global store; renders a helpful message if nothing is
    selected.
  - Tabs with validation errors show red borders.
*/
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {useStore} from '../../state/store'
import { useTreeValidation } from '../../lib/validation'
import ValidationIcon from '../common/ValidationIcon'
import AppearanceEditor from './AppearanceEditor'
import RequirementsEditor from './RequirementsEditor'
import NotificationsEditor from './NotificationsEditor'
import SkillsPanel from './SkillsPanel'
import EligiblePetsEditor from './EligiblePetsEditor'
import PropertiesEditor from './PropertiesEditor'

/** Map internal tab state values to TabName values used by validation */
const TAB_TO_VALIDATION_KEY = {
    properties: 'properties',
    header: 'appearance',
    eligible: 'eligible',
    requirements: 'requirements',
    notifications: 'notifications',
    skills: 'skills'
} as const

/** SkilltreeEditor — tabbed container for sub-editors of the selected tree. */
export default function SkilltreeEditor() {
    const { t } = useTranslation()
    const selectedId = useStore(s => s.selectedId)
    const tree = useStore(s => s.trees.find(t => t.ID === selectedId))
    const { tabErrors } = useTreeValidation(selectedId ?? undefined)

    const [tab, setTab] = useState<'header' | 'properties' | 'eligible' | 'requirements' | 'notifications' | 'skills'>('header')

    if (!tree) return <p>{t('home.description')}</p>

    // Helper to build tab class names
    const tabClass = (tabKey: keyof typeof TAB_TO_VALIDATION_KEY) => {
        const isActive = tab === tabKey
        const validationKey = TAB_TO_VALIDATION_KEY[tabKey]
        const hasError = tabErrors[validationKey]
        return 'tab' + (isActive ? ' tab--active' : '') + (hasError ? ' tab--error' : '')
    }

    // Helper to check if a tab has errors
    const hasTabError = (tabKey: keyof typeof TAB_TO_VALIDATION_KEY) => {
        return tabErrors[TAB_TO_VALIDATION_KEY[tabKey]]
    }

    // Check if the currently active tab has errors (for panel border)
    const activeTabHasError = tabErrors[TAB_TO_VALIDATION_KEY[tab]]

    return (
        <div className="skilltree-editor">
            <div className={activeTabHasError ? 'tabs tabs--has-error' : 'tabs'}>
                <button className={tabClass('properties')} onClick={() => setTab('properties')}>
                    {t('tabs.properties')}
                    {hasTabError('properties') && <ValidationIcon size={12} title={t('validation.hasErrors')} />}
                </button>
                <button className={tabClass('header')} onClick={() => setTab('header')}>
                    {t('tabs.appearance')}
                    {hasTabError('header') && <ValidationIcon size={12} title={t('validation.hasErrors')} />}
                </button>
                <button className={tabClass('eligible')} onClick={() => setTab('eligible')}>
                    {t('tabs.eligiblePets')}
                    {hasTabError('eligible') && <ValidationIcon size={12} title={t('validation.hasErrors')} />}
                </button>
                <button className={tabClass('requirements')} onClick={() => setTab('requirements')}>
                    {t('tabs.requirements')}
                    {hasTabError('requirements') && <ValidationIcon size={12} title={t('validation.hasErrors')} />}
                </button>
                <button className={tabClass('notifications')} onClick={() => setTab('notifications')}>
                    {t('tabs.notifications')}
                    {hasTabError('notifications') && <ValidationIcon size={12} title={t('validation.hasErrors')} />}
                </button>
                <button className={tabClass('skills')} onClick={() => setTab('skills')}>
                    {t('tabs.skills')}
                    {hasTabError('skills') && <ValidationIcon size={12} title={t('validation.hasErrors')} />}
                </button>
            </div>

            <div className={activeTabHasError ? 'tab-panel tab-panel--error' : 'tab-panel'}>
                {tab === 'header' && <AppearanceEditor/>}
                {tab === 'properties' && <PropertiesEditor/>}
                {tab === 'eligible' && <EligiblePetsEditor/>}
                {tab === 'requirements' && <RequirementsEditor/>}
                {tab === 'notifications' && <NotificationsEditor/>}
                {tab === 'skills' && <SkillsPanel tree={tree}/>}
            </div>
        </div>
    )
}

