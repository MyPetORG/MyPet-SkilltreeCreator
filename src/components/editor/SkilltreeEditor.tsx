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
*/
import React, { useState } from 'react'
import {useStore} from '../../state/store'
import AppearanceEditor from './AppearanceEditor'
import RequirementsEditor from './RequirementsEditor'
import NotificationsEditor from './NotificationsEditor'
import SkillsPanel from './SkillsPanel'
import EligiblePetsEditor from './EligiblePetsEditor'
import PropertiesEditor from './PropertiesEditor'

/** SkilltreeEditor — tabbed container for sub-editors of the selected tree. */
export default function SkilltreeEditor() {
    const selectedId = useStore(s => s.selectedId)
    const tree = useStore(s => s.trees.find(t => t.ID === selectedId))

    const [tab, setTab] = useState<'header' | 'properties' | 'eligible' | 'requirements' | 'notifications' | 'skills'>('header')

    if (!tree) return <p>Select a skilltree on the left.</p>

    return (
        <div className="skilltree-editor">
            <div className="tabs">
                <button
                    className={"tab" + (tab === 'properties' ? ' tab--active' : '')}
                    onClick={() => setTab('properties')}
                >Properties</button>
                <button
                    className={"tab" + (tab === 'header' ? ' tab--active' : '')}
                    onClick={() => setTab('header')}
                >Appearance</button>
                <button
                    className={"tab" + (tab === 'eligible' ? ' tab--active' : '')}
                    onClick={() => setTab('eligible')}
                >Eligible Pets</button>
                <button
                    className={"tab" + (tab === 'requirements' ? ' tab--active' : '')}
                    onClick={() => setTab('requirements')}
                >Requirements</button>
                <button
                    className={"tab" + (tab === 'notifications' ? ' tab--active' : '')}
                    onClick={() => setTab('notifications')}
                >Notifications</button>
                <button
                    className={"tab" + (tab === 'skills' ? ' tab--active' : '')}
                    onClick={() => setTab('skills')}
                >Skills</button>
            </div>

            {tab === 'header' && <AppearanceEditor/>}
            {tab === 'properties' && <PropertiesEditor/>}
            {tab === 'eligible' && <EligiblePetsEditor/>}
            {tab === 'requirements' && <RequirementsEditor/>}
            {tab === 'notifications' && <NotificationsEditor/>}
            {tab === 'skills' && <SkillsPanel tree={tree}/>}            
        </div>
    )
}

