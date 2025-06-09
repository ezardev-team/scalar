<template>
  <Teleport to="body">
    <div
      v-if="modalState.open"
      class="scalar-json-viewer-modal-overlay"
      @click.self="modalState.hide()">
      <div class="scalar-json-viewer-modal-dialog">
        <div class="scalar-json-viewer-modal-header">
          <h3 class="scalar-json-viewer-modal-title">
            {{ title || 'JSON Viewer' }}
          </h3>
          <button
            class="scalar-json-viewer-modal-close"
            type="button"
            @click="modalState.hide()">
            ×
          </button>
        </div>
        <div class="scalar-json-viewer-modal__content">
          <ScalarJsonViewer
            :data="data"
            :content="content"
            :title="title"
            :show-toolbar="false"
            :show-copy-button="showCopyButton"
            :show-fullscreen-button="false"
            :show-line-numbers="showLineNumbers"
            :fold-gutter="foldGutter"
            :editable="editable"
            :placeholder="placeholder"
            :prettify="prettify"
            :indent="indent"
            @change="emit('change', $event)"
            @copy="emit('copy', $event)" />
        </div>
        <div class="scalar-json-viewer-modal__footer">
          <div class="scalar-json-viewer-modal__actions">
            <ScalarButton
              v-if="showCopyButton"
              variant="outlined"
              @click="handleCopy">
              Copy JSON
            </ScalarButton>
            <ScalarButton
              variant="solid"
              @click="modalState.hide()">
              Close
            </ScalarButton>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { Teleport, computed, onMounted, onUnmounted, watch } from 'vue'

import { ScalarButton } from '../ScalarButton'
import { useModal } from '../ScalarModal'
import ScalarJsonViewer from './ScalarJsonViewer.vue'
import type { ScalarJsonViewerModalProps } from './types'

const props = withDefaults(defineProps<ScalarJsonViewerModalProps>(), {
  showCopyButton: true,
  showLineNumbers: true,
  foldGutter: true,
  editable: false,
  placeholder: 'No JSON data',
  prettify: true,
  indent: 2,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'change': [content: string]
  'copy': [content: string]
}>()

const modalState = useModal()

// Handle ESC key to close modal
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && modalState.open) {
    event.preventDefault()
    event.stopPropagation()
    modalState.hide()
  }
}

// Add/remove event listeners
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

// Watch for modalState to prevent body scroll
watch(
  () => modalState.open,
  (isOpen) => {
    if (isOpen) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    } else {
      // Restore body scroll when modal is closed
      document.body.style.overflow = ''
    }
  },
)

// Watch for modelValue changes to sync with modal state
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      modalState.show()
    } else {
      modalState.hide()
    }
  },
  { immediate: true },
)

// Watch for modal state changes to emit modelValue updates
watch(
  () => modalState.open,
  (newValue) => {
    if (newValue !== props.modelValue) {
      emit('update:modelValue', newValue)
    }
  },
)

const formattedJson = computed(() => {
  if (props.content) {
    if (props.prettify) {
      try {
        const parsed = JSON.parse(props.content)
        return JSON.stringify(parsed, null, props.indent)
      } catch {
        return props.content
      }
    }
    return props.content
  }

  if (props.data !== undefined) {
    try {
      return JSON.stringify(props.data, null, props.prettify ? props.indent : 0)
    } catch {
      return String(props.data)
    }
  }

  return ''
})

const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(formattedJson.value)
    emit('copy', formattedJson.value)
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
  }
}
</script>

<style scoped>
/* Modal Overlay - covers entire screen */
.scalar-json-viewer-modal-overlay {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  background-color: rgba(0, 0, 0, 0.5) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  z-index: 2147483647 !important; /* Maximum z-index */
  overscroll-behavior: contain;
}

/* Modal Dialog */
.scalar-json-viewer-modal-dialog {
  background: var(--scalar-background-1);
  border-radius: 8px;
  box-shadow: var(--scalar-shadow-2);
  width: 90vw;
  max-width: 800px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Modal Header */
.scalar-json-viewer-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid var(--scalar-border-color);
}

.scalar-json-viewer-modal-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--scalar-color-1);
}

.scalar-json-viewer-modal-close {
  background: none;
  border: none;
  font-size: 24px;
  line-height: 1;
  color: var(--scalar-color-3);
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
}

.scalar-json-viewer-modal-close:hover {
  background-color: var(--scalar-background-3);
}

/* Remove all old z-index overrides that were trying to override ScalarModal */
.scalar-json-viewer-modal-container {
  display: none;
}

.scalar-json-viewer-modal__content {
  flex: 1;
  overflow: auto;
  padding: 16px;
  min-height: 400px;
  overscroll-behavior: contain;
}

.scalar-json-viewer-modal__content :deep(.scalar-json-viewer) {
  height: 100%;
  border: none;
  border-radius: 0;
}

.scalar-json-viewer-modal__footer {
  display: flex;
  justify-content: flex-end;
  padding: 16px;
  border-top: 1px solid var(--scalar-border-color);
}

.scalar-json-viewer-modal__actions {
  display: flex;
  gap: 8px;
}

/* Animation */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.scalar-json-viewer-modal-overlay {
  animation: fadeIn 0.2s ease-out;
}

.scalar-json-viewer-modal-dialog {
  animation: slideIn 0.3s ease-out;
}
</style>
