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
  AlertModal.tsx — Custom alert dialog with i18n support.

  Responsibilities:
  - Replace native window.alert() with translatable modal
  - Provide AlertProvider context and useAlert hook
  - Match existing modal styling (ImportModal pattern)
  - Support keyboard navigation (Enter/Escape to dismiss)
*/

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

interface AlertOptions {
  title?: string
  okText?: string
}

interface AlertState {
  isOpen: boolean
  message: string
  options: AlertOptions
  resolve: (() => void) | null
}

type AlertFn = (message: string, options?: AlertOptions) => Promise<void>

const AlertContext = createContext<AlertFn | null>(null)

/**
 * Provider component for alert dialog functionality.
 * Wrap your app with this to enable useAlert() hook.
 */
export function AlertProvider({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation()
  const [state, setState] = useState<AlertState>({
    isOpen: false,
    message: '',
    options: {},
    resolve: null,
  })
  const okButtonRef = useRef<HTMLButtonElement>(null)

  const alert = useCallback<AlertFn>((message, options = {}) => {
    return new Promise((resolve) => {
      setState({
        isOpen: true,
        message,
        options,
        resolve,
      })
    })
  }, [])

  const handleClose = useCallback(() => {
    state.resolve?.()
    setState((s) => ({ ...s, isOpen: false, resolve: null }))
  }, [state.resolve])

  // Focus OK button when modal opens
  useEffect(() => {
    if (state.isOpen) {
      okButtonRef.current?.focus()
    }
  }, [state.isOpen])

  // Handle keyboard events
  useEffect(() => {
    if (!state.isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter') {
        handleClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [state.isOpen, handleClose])

  return (
    <AlertContext.Provider value={alert}>
      {children}
      {state.isOpen && (
        <div className="modal-backdrop" onClick={handleClose}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{state.options.title || t('modals.alert.title')}</h3>
            <p style={{ marginTop: 8, whiteSpace: 'pre-wrap' }}>{state.message}</p>

            <div className="modal-actions">
              <button
                ref={okButtonRef}
                className="btn btn--primary"
                onClick={handleClose}
              >
                {state.options.okText || t('actions.ok')}
              </button>
            </div>
          </div>
        </div>
      )}
    </AlertContext.Provider>
  )
}

/**
 * Hook to show an alert dialog.
 * Must be used within AlertProvider.
 *
 * @example
 * const alert = useAlert()
 * await alert('Operation completed!')
 */
export function useAlert(): AlertFn {
  const alert = useContext(AlertContext)
  if (!alert) {
    throw new Error('useAlert must be used within AlertProvider')
  }
  return alert
}
