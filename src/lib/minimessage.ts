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
  minimessage.ts — Wrapper utility for minimessage-js library.

  Provides:
  - toHtml(): Convert MiniMessage string to HTML
  - Display mode types and CSS class helpers
  - Error handling with plaintext fallback
*/

import MiniMessage from 'minimessage-js'

export type DisplayMode = 'chat' | 'lore'

/**
 * Parse MiniMessage string and convert to HTML string.
 * The HTML uses inline styles for colors and decorations.
 *
 * @param input - MiniMessage formatted string
 * @returns HTML string safe for dangerouslySetInnerHTML
 */
export function toHtml(input: string): string {
  if (!input || !input.trim()) return ''

  try {
    const component = MiniMessage.miniMessage().deserialize(input)
    return MiniMessage.toHTML(component)
  } catch (e) {
    // Fallback: escape and return as plain text on parse error
    console.warn('MiniMessage parse error:', e)
    return escapeHtml(input)
  }
}

/**
 * Convert multi-line MiniMessage text to HTML for lore-style display.
 * Each line is wrapped in a div for proper vertical stacking.
 *
 * @param input - MiniMessage formatted string (may contain newlines)
 * @returns HTML string with each line in a div
 */
export function toHtmlLore(input: string): string {
  if (!input || !input.trim()) return ''

  return input
    .split('\n')
    .map(line => `<div>${line.trim() ? toHtml(line) : '&nbsp;'}</div>`)
    .join('')
}

/**
 * Convert MiniMessage text to HTML for chat-style display.
 * Only renders the first line (Minecraft chat is single-line).
 *
 * @param input - MiniMessage formatted string
 * @returns HTML string for single line
 */
export function toHtmlChat(input: string): string {
  if (!input || !input.trim()) return ''

  const firstLine = input.split('\n')[0]
  return toHtml(firstLine)
}

/**
 * Escape HTML special characters for safe display
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/**
 * Get CSS class for preview container based on display mode
 */
export function getPreviewModeClass(mode: DisplayMode): string {
  switch (mode) {
    case 'chat':
      return 'mc-preview mc-preview-chat'
    case 'lore':
      return 'mc-preview mc-preview-lore'
    default:
      return 'mc-preview mc-preview-lore'
  }
}
