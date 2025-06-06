<script lang="ts" setup>
import { standardLanguages, syntaxHighlight } from '@scalar/code-highlight'
import { prettyPrintJson } from '@scalar/oas-utils/helpers'
import { useClipboard } from '@scalar/use-hooks/useClipboard'
import { computed, ref } from 'vue'

import { ScalarIcon } from '../ScalarIcon'
import { ScalarJsonViewerModal } from '../ScalarJsonViewer'

/**
 * Uses highlight.js for syntax highlighting
 */
const props = withDefaults(
  defineProps<{
    content: string | object
    lang?: string
    lineNumbers?: boolean
    hideCredentials?: string | string[]
    copy?: boolean
    expand?: boolean
  }>(),
  {
    lang: 'plaintext',
    lineNumbers: false,
    copy: true,
    expand: false,
  },
)

const highlightedCode = computed(() => {
  const html = syntaxHighlight(prettyPrintJson(props.content), {
    lang: props.lang.trim(),
    languages: standardLanguages,
    lineNumbers: props.lineNumbers,
    maskCredentials: props.hideCredentials,
  })

  // Need to remove the wrapping <pre> element so we can use v-html without another wrapper
  return html.slice(5, -6)
})

const { copyToClipboard } = useClipboard()

const isContentValid = computed(() => {
  return (
    props.content !== null &&
    props.content !== 'null' &&
    props.content !== '404 Not Found'
  )
})

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
    class="scalar-code-block custom-scroll min-h-12 focus-visible:outline"
    tabindex="0">
    <div
      v-if="expand || copy"
      class="scalar-code-actions">
      <button
        v-if="expand && isContentValid"
        class="expand-button"
        type="button"
        @click="openJsonViewer">
        <span class="sr-only">View in new window</span>
        <ScalarIcon
          icon="Expand"
          size="md" />
      </button>
      <button
        v-if="copy && isContentValid"
        class="copy-button"
        type="button"
        @click="copyToClipboard(prettyPrintJson(props.content))">
        <span class="sr-only">Copy content</span>
        <ScalarIcon
          icon="Clipboard"
          size="md" />
      </button>
    </div>
    <pre
      class="scalar-codeblock-pre"
      v-html="highlightedCode" />

    <!-- JSON Viewer Modal -->
    <ScalarJsonViewerModal
      v-model="showJsonModal"
      :content="prettyPrintJson(props.content)"
      :editable="false"
      :prettify="true"
      @copy="copyToClipboard" />
  </div>
</template>
<style>
@import '@scalar/code-highlight/css/code.css';
.scalar-code-block {
  background: inherit;
  position: relative;
  overflow: auto;
  padding: 0.75rem;
}
.scalar-code-block:hover .copy-button,
.scalar-code-block:hover .expand-button,
.copy-button:focus-visible,
.expand-button:focus-visible {
  opacity: 100;
}
/* Code blocks */
.scalar-codeblock-pre {
  all: unset;
  margin: 0;
  background: transparent;
  text-wrap: nowrap;
  white-space-collapse: preserve;
  border-radius: 0;
  width: fit-content;
}
/* Action Buttons */
.scalar-code-actions {
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  gap: 4px;

  position: sticky;
  inset: 0;
}
.copy-button,
.expand-button {
  position: relative;
  top: 0px;
  right: 0px;

  display: flex;
  align-items: center;

  background-color: var(--scalar-background-2);
  border: 1px solid var(--scalar-border-color);
  border-radius: 3px;
  color: var(--scalar-color-3);
  cursor: pointer;
  height: 30px;
  margin-bottom: -30px;
  opacity: 0;
  padding: 6px;
  transition:
    opacity 0.15s ease-in-out,
    color 0.15s ease-in-out;
}
.scalar-code-actions,
.copy-button,
.expand-button {
  /* Pass down the background color */
  background: inherit;
}
.copy-button:hover,
.expand-button:hover {
  color: var(--scalar-color-1);
}
.copy-button svg,
.expand-button svg {
  stroke-width: 1.5;
}
</style>
