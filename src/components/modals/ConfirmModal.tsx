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
  ConfirmModal.tsx — Custom confirm dialog with i18n support.

  Responsibilities:
  - Replace native window.confirm() with translatable modal
  - Provide ConfirmProvider context and useConfirm hook
  - Match existing modal styling (ImportModal pattern)
  - Support keyboard navigation (Enter to confirm, Escape to cancel)
*/

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

interface ConfirmOptions {
  title?: string
  confirmText?: string
  cancelText?: string
}

interface ConfirmState {
  isOpen: boolean
  message: string
  options: ConfirmOptions
  resolve: ((value: boolean) => void) | null
}

type ConfirmFn = (message: string, options?: ConfirmOptions) => Promise<boolean>

const ConfirmContext = createContext<ConfirmFn | null>(null)

/**
 * Provider component for confirm dialog functionality.
 * Wrap your app with this to enable useConfirm() hook.
 */
export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation()
  const [state, setState] = useState<ConfirmState>({
    isOpen: false,
    message: '',
    options: {},
    resolve: null,
  })
  const confirmButtonRef = useRef<HTMLButtonElement>(null)

  const confirm = useCallback<ConfirmFn>((message, options = {}) => {
    return new Promise((resolve) => {
      setState({
        isOpen: true,
        message,
        options,
        resolve,
      })
    })
  }, [])

  const handleConfirm = useCallback(() => {
    state.resolve?.(true)
    setState((s) => ({ ...s, isOpen: false, resolve: null }))
  }, [state.resolve])

  const handleCancel = useCallback(() => {
    state.resolve?.(false)
    setState((s) => ({ ...s, isOpen: false, resolve: null }))
  }, [state.resolve])

  // Focus confirm button when modal opens
  useEffect(() => {
    if (state.isOpen) {
      confirmButtonRef.current?.focus()
    }
  }, [state.isOpen])

  // Handle keyboard events
  useEffect(() => {
    if (!state.isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCancel()
      } else if (e.key === 'Enter') {
        handleConfirm()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [state.isOpen, handleConfirm, handleCancel])

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {state.isOpen && (
        <div className="modal-backdrop" onClick={handleCancel}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{state.options.title || t('modals.confirm.title')}</h3>
            <p style={{ marginTop: 8, whiteSpace: 'pre-wrap' }}>{state.message}</p>

            <div className="modal-actions">
              <button className="btn" onClick={handleCancel}>
                {state.options.cancelText || t('actions.cancel')}
              </button>
              <button
                ref={confirmButtonRef}
                className="btn btn--primary"
                onClick={handleConfirm}
              >
                {state.options.confirmText || t('actions.confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  )
}

/**
 * Hook to show a confirm dialog.
 * Must be used within ConfirmProvider.
 *
 * @example
 * const confirm = useConfirm()
 * const ok = await confirm('Delete this item?')
 * if (ok) { ... }
 */
export function useConfirm(): ConfirmFn {
  const confirm = useContext(ConfirmContext)
  if (!confirm) {
    throw new Error('useConfirm must be used within ConfirmProvider')
  }
  return confirm
}
