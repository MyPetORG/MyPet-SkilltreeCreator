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
  Sidebar.tsx — Draggable list of skilltrees with collapse/expand and status.

  Features:
  - Reorder via drag-and-drop (dnd-kit)
  - Select, create, delete callbacks for parent
  - Collapsible rail mode showing only icons
  - Per-tree validation indicators (red icon in expanded, red border in collapsed)
*/
import React, { useEffect, useMemo, useState } from 'react'
import { ItemIcon } from '../../lib/mcIcons'
import { useAllTreesValidation } from '../../lib/validation'
import ValidationIcon from '../common/ValidationIcon'

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

export type SidebarItem = {
  /** Unique id used for selection and DnD identity */
  id: string
  /** Primary label shown in the list */
  name: string
  /** Optional smaller secondary label */
  subtitle?: string
  /** Optional item/block id rendered with ItemIcon */
  icon?: string
  /** Marks the item as currently selected */
  selected?: boolean
}

/** Props for the Sidebar component */
 type Props = {
  items: SidebarItem[]
  onSelect?: (id: string) => void
  onCreate?: () => void
  onDelete?: (id: string) => void
  onReorder?: (fromIndex: number, toIndex: number) => void
  footerSlot?: React.ReactNode
}

/** Sidebar — vertical list with drag-and-drop reordering and collapse control. */
export default function Sidebar({ items, onSelect, onCreate, onDelete, onReorder, footerSlot }: Props) {
  // Get validation state for all trees
  const { treeErrors } = useAllTreesValidation()

  // Canonical dnd-kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } })
  )

  const ids = useMemo(() => items.map((it) => it.id), [items])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    // Toggle a body-level class so the app grid can change columns when collapsed
    document.body.classList.toggle('app--sidebar-collapsed', collapsed)
    return () => document.body.classList.remove('app--sidebar-collapsed')
  }, [collapsed])

  const activeItem = useMemo(
    () => items.find((it) => it.id === activeId) || null,
    [activeId, items]
  )

  const handleDragStart = (e: DragStartEvent) => {
    setActiveId(String(e.active.id))
  }

  const handleDragEnd = (e: DragEndEvent) => {
    const a = e.active?.id ? String(e.active.id) : null
    const o = e.over?.id ? String(e.over.id) : null

    if (!a || !o || a === o) {
      // No drop target or dropped on itself – keep selection on the dragged item
      if (a) {
        // Defer to ensure we run after any parent effects
        Promise.resolve().then(() => onSelect?.(a))
      }
      setActiveId(null)
      return
    }

    const fromIndex = ids.indexOf(a)
    const toIndex = ids.indexOf(o)
    if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) {
      Promise.resolve().then(() => onSelect?.(a))
      setActiveId(null)
      return
    }

    onReorder?.(fromIndex, toIndex)

    // Re-select the dragged item after the parent applies the reorder
    Promise.resolve().then(() => onSelect?.(a))

    setActiveId(null)
  }

  const handleDragCancel = () => setActiveId(null)

  return (
    <aside className={`sidebar${collapsed ? ' sidebar--collapsed' : ''}`}>
      <div className={`sidebar__header${collapsed ? ' sidebar__header--collapsed' : ''}`}>
        {!collapsed && <div className="sidebar__title">Skilltrees</div>}
        <div className="sidebar__header-actions">
          <button
            className="btn btn--icon sidebar__collapse"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={collapsed ? 'Expand' : 'Collapse'}
            onClick={() => setCollapsed(v => !v)}
          >{collapsed ? '⮞' : '⮜'}</button>
        </div>
      </div>

      {collapsed ? (
        <ul className="sidebar__rail" aria-label="Skilltree selectors (collapsed)">
          {items.map((it) => {
            const hasError = treeErrors.get(it.id) ?? false
            return (
              <li key={it.id} className="sidebar__rail-item">
                <button
                  className={`rail__btn${it.selected ? ' is-selected' : ''}${hasError ? ' has-error' : ''}`}
                  title={hasError ? `${it.name} (has validation errors)` : it.name}
                  aria-label={hasError ? `${it.name} (has validation errors)` : it.name}
                  onClick={() => onSelect?.(it.id)}
                >
                  <ItemIcon id={it.icon} alt={it.icon || 'item'} className="rail__emoji" />
                </button>
              </li>
            )
          })}
          <li className="sidebar__rail-item">
            <button
              className="rail__btn rail__btn--new"
              title="New skilltree"
              aria-label="New skilltree"
              onClick={() => onCreate?.()}
            >
              <span className="rail__emoji" aria-hidden>＋</span>
            </button>
          </li>
        </ul>
      ) : (
        <div className="sidebar__content">
          <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragCancel={handleDragCancel}>
            <SortableContext items={ids} strategy={verticalListSortingStrategy}>
              <ul className="sidebar__list">
                {items.map((it) => (
                  <SortableRow
                    key={it.id}
                    item={it}
                    hasError={treeErrors.get(it.id) ?? false}
                    onSelect={onSelect}
                    onDelete={onDelete}
                  />
                ))}
                {/* New skilltree CTA (not part of Sortable items) */}
                <li className="sidebar__item sidebar__item--new" aria-hidden={false}>
                  <button className="sidebar__new-btn" onClick={() => onCreate?.()}>＋ New skilltree</button>
                </li>
              </ul>
            </SortableContext>

            <DragOverlay dropAnimation={{ duration: 150 }}>
                {activeItem ? (
                    <li
                        className={
                            `sidebar__item drag-overlay-row${activeItem.selected ? ' is-selected' : ''}`
                        }
                    >
                        <button className="btn btn--icon drag-handle drag-handle--v" aria-hidden />
                        <RowMarkup item={activeItem} hasError={treeErrors.get(activeItem.id) ?? false} />
                    </li>
                ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      )}

      {!collapsed && (<div className="sidebar__footer">{footerSlot}</div>)}
    </aside>
  )
}

// ----- Sortable Row (canonical dnd-kit pattern) -----
function SortableRow({ item, hasError, onSelect, onDelete }: {
  item: SidebarItem
  hasError?: boolean
  onSelect?: (id: string) => void
  onDelete?: (id: string) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id })

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    // Hide the original row visually during drag so the DragOverlay is the only visible copy,
    // but keep its layout box for correct hit-testing.
    opacity: isDragging ? 0 : 1,
    pointerEvents: isDragging ? 'none' : undefined,
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`sidebar__item ${item.selected ? 'is-selected' : ''}`}
      {...attributes}
    >
      <button
        className="btn btn--icon drag-handle drag-handle--v"
        title="Reorder"
        aria-label="Drag to reorder"
        ref={setActivatorNodeRef}
        {...listeners}
        onClick={(e) => { e.stopPropagation(); onSelect?.(item.id) }}
      />
      <RowMarkup item={item} hasError={hasError} onSelect={onSelect} onDelete={onDelete} />
    </li>
  )
}

// Pure markup for a row (used by both list items and DragOverlay)
function RowMarkup({ item, hasError, onSelect, onDelete }: {
  item: SidebarItem
  hasError?: boolean
  onSelect?: (id: string) => void
  onDelete?: (id: string) => void
}) {
  return (
    <>
      <div className="sidebar__item-icon" title={item.icon || ''}>
        <ItemIcon id={item.icon} alt={item.icon || 'item'} className="sidebar__item-icon-img" />
      </div>
      <div className="sidebar__item-texts" onClick={() => onSelect?.(item.id)}>
        <div className="sidebar__item-name">
          {item.name}
          {hasError && (
            <ValidationIcon
              size={14}
              title="This skilltree has validation errors"
              className="sidebar__validation-icon"
            />
          )}
        </div>
        {item.subtitle && <div className="sidebar__item-sub">{item.subtitle}</div>}
      </div>
      <button
        className="btn btn--icon"
        title="Delete"
        onClick={(e) => { e.stopPropagation(); onDelete?.(item.id) }}
      >🗑️</button>
    </>
  )
}
