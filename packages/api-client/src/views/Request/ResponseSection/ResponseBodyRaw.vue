<script lang="ts" setup>
import { ScalarIcon } from '@scalar/components'
import { ScalarJsonViewerModal } from '@scalar/json-viewer'
import { prettyPrintJson } from '@scalar/oas-utils/helpers'
import { useCodeMirror, type CodeMirrorLanguage } from '@scalar/use-codemirror'
import { useClipboard } from '@scalar/use-hooks/useClipboard'
import { ref, toRef } from 'vue'

const props = defineProps<{
  content: any
  language: CodeMirrorLanguage | undefined
}>()

const codeMirrorRef = ref<HTMLDivElement | null>(null)
const { copyToClipboard } = useClipboard()

const { codeMirror } = useCodeMirror({
  codeMirrorRef,
  readOnly: true,
  lineNumbers: true,
  content: toRef(() => prettyPrintJson(props.content)),
  language: toRef(() => props.language),
  forceFoldGutter: true,
})

// Function to get current content
const getCurrentContent = () => {
  return codeMirror.value?.state.doc.toString() || ''
}

// JSON Viewer Modal state
const showJsonModal = ref(false)

const openJsonViewer = () => {
  console.log('OpenJsonViewer clicked, current state:', showJsonModal.value)
  showJsonModal.value = true
  console.log('New state:', showJsonModal.value)
}
</script>
<template>
  <div
    class="body-raw grid min-h-0 overflow-hidden p-px outline-none has-[:focus-visible]:outline">
    <div
      v-if="getCurrentContent()"
      class="scalar-code-actions">
      <button
        class="expand-button"
        type="button"
        @click="openJsonViewer">
        <span class="sr-only">View in JSON Viewer</span>
        <ScalarIcon
          icon="Expand"
          size="md" />
      </button>
      <!-- Copy button -->
      <button
        class="copy-button"
        type="button"
        @click="copyToClipboard(prettyPrintJson(props.content))">
        <span class="sr-only">Copy content</span>
        <ScalarIcon
          icon="Clipboard"
          size="md" />
      </button>
    </div>
    <div
      class="body-raw-scroller custom-scroll relative overflow-x-auto overscroll-contain"
      tabindex="0">
      <!-- CodeMirror container -->
      <div ref="codeMirrorRef" />
    </div>

    <!-- JSON Viewer Modal -->
    <ScalarJsonViewerModal
      v-model="showJsonModal"
      :content="prettyPrintJson(props.content)"
      :editable="false"
      :prettify="true"
      @copy="copyToClipboard" />
  </div>
</template>
<style scoped>
:deep(.cm-editor) {
  background-color: transparent;
  font-size: var(--scalar-mini);
  outline: none;
}
:deep(.cm-gutters) {
  background-color: var(--scalar-background-1);
  border-radius: var(--scalar-radius) 0 0 var(--scalar-radius);
}

.body-raw :deep(.cm-scroller) {
  overflow: visible;
  width: fit-content;
}

/* Action Buttons Styles */
.scalar-code-actions {
  align-items: flex-start;
  display: flex;
  position: absolute;
  top: 6px;
  right: 6px;
  z-index: 10;
  pointer-events: none;
  position: sticky;
  transform: translateX(-6px);
  gap: 4px;
}

.copy-button,
.expand-button {
  align-items: center;
  display: flex;
  background-color: var(--scalar-background-1);
  border: 1px solid var(--scalar-border-color);
  border-radius: 3px;
  color: var(--scalar-color-3);
  cursor: pointer;
  height: 30px;
  opacity: 0;
  padding: 6px;
  pointer-events: auto;
  transition:
    opacity 0.15s ease-in-out,
    color 0.15s ease-in-out;
}

/* Show buttons on container hover */
.body-raw:hover .copy-button,
.body-raw:hover .expand-button,
.copy-button:focus-visible,
.expand-button:focus-visible {
  opacity: 1;
}

.copy-button:hover,
.expand-button:hover {
  color: var(--scalar-color-1);
}
</style>
