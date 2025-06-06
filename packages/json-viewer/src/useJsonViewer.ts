import { ref, type App } from 'vue'

import type { ScalarJsonViewerProps } from './types'

export interface JsonViewerOptions extends Omit<ScalarJsonViewerProps, 'showToolbar' | 'showFullscreenButton'> {
  /** Callback when the modal is closed */
  onClose?: () => void
  /** Callback when JSON is copied */
  onCopy?: (content: string) => void
  /** Callback when content changes (for editable mode) */
  onChange?: (content: string) => void
}

const modals = ref<Array<{ id: string; options: JsonViewerOptions; isOpen: boolean }>>([])

export const useJsonViewer = () => {
  /**
   * Open a JSON viewer modal
   */
  const openJsonViewer = (options: JsonViewerOptions) => {
    const id = `json-viewer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    modals.value.push({
      id,
      options,
      isOpen: true,
    })

    return {
      id,
      close: () => closeJsonViewer(id),
    }
  }

  /**
   * Close a specific JSON viewer modal
   */
  const closeJsonViewer = (id: string) => {
    const modalIndex = modals.value.findIndex(modal => modal.id === id)
    if (modalIndex !== -1) {
      const modal = modals.value[modalIndex]
      modal.isOpen = false
      modal.options.onClose?.()
      
      // Remove modal after animation
      setTimeout(() => {
        modals.value.splice(modalIndex, 1)
      }, 300)
    }
  }

  /**
   * Close all JSON viewer modals
   */
  const closeAllJsonViewers = () => {
    modals.value.forEach(modal => {
      modal.isOpen = false
      modal.options.onClose?.()
    })
    
    setTimeout(() => {
      modals.value.splice(0)
    }, 300)
  }

  return {
    modals: modals.value,
    openJsonViewer,
    closeJsonViewer,
    closeAllJsonViewers,
  }
}

// Global helper functions
let app: App | null = null

export const setJsonViewerApp = (appInstance: App) => {
  app = appInstance
}

/**
 * Global function to open JSON viewer modal
 * Usage: openJsonViewer({ data: { foo: 'bar' }, title: 'My JSON' })
 */
export const openJsonViewer = (options: JsonViewerOptions) => {
  const { openJsonViewer: open } = useJsonViewer()
  return open(options)
}

/**
 * Global function to close all JSON viewer modals
 */
export const closeAllJsonViewers = () => {
  const { closeAllJsonViewers: closeAll } = useJsonViewer()
  closeAll()
} 