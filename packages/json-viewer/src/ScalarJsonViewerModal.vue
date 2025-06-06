<template>
  <ScalarModal
    :state="modalState"
    :title="title || 'JSON Viewer'"
    size="lg">
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
  </ScalarModal>
</template>

<script setup lang="ts">
import { ScalarButton, ScalarModal, useModal } from '@scalar/components'
import { computed, watch } from 'vue'

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
.scalar-json-viewer-modal__content {
  height: 60vh;
  min-height: 400px;
}

.scalar-json-viewer-modal__content :deep(.scalar-json-viewer) {
  height: 100%;
  border: none;
  border-radius: 0;
}

.scalar-json-viewer-modal__footer {
  display: flex;
  justify-content: flex-end;
  padding: 16px 0 0;
  border-top: 1px solid var(--scalar-border-color);
}

.scalar-json-viewer-modal__actions {
  display: flex;
  gap: 8px;
}
</style>
