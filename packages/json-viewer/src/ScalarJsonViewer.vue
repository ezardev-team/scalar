<template>
  <div
    class="scalar-json-viewer"
    :class="{ 'scalar-json-viewer--fullscreen': fullscreen }">
    <div
      v-if="showToolbar"
      class="scalar-json-viewer__toolbar">
      <div class="scalar-json-viewer__info">
        <span class="scalar-json-viewer__title">
          {{ title || 'JSON Viewer' }}
        </span>
        <span
          v-if="showSize"
          class="scalar-json-viewer__size">
          {{ formattedSize }}
        </span>
      </div>

      <div class="scalar-json-viewer__actions">
        <!-- 복사 버튼 (ClipboardIcon 사용) -->
        <button
          v-if="showCopyButton"
          class="scalar-json-viewer__btn"
          aria-label="Copy JSON"
          @click="copyToClipboard">
          <ScalarIconClipboard class="scalar-json-viewer__btn-icon" />
        </button>

        <!-- 전체화면 토글 버튼 -->
        <button
          v-if="showFullscreenButton"
          class="scalar-json-viewer__btn"
          :aria-label="fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'"
          @click="toggleFullscreen">
          <component
            :is="fullscreen ? ScalarIconArrowLeft : ScalarIconArrowRight"
            class="scalar-json-viewer__btn-icon" />
        </button>
      </div>
    </div>

    <div class="scalar-json-viewer__content custom-scroll">
      <div
        ref="codeMirrorRef"
        class="scalar-json-viewer__editor" />
    </div>
  </div>
</template>

<script setup lang="ts">
// 아이콘 컴포넌트만 별도 import
import {
  ScalarIconArrowLeft,
  ScalarIconArrowRight,
  ScalarIconClipboard,
} from '@scalar/icons'
import { useCodeMirror } from '@scalar/use-codemirror'
import { computed, ref, watch } from 'vue'

import type { ScalarJsonViewerProps } from './types'

const props = withDefaults(defineProps<ScalarJsonViewerProps>(), {
  showToolbar: true,
  showSize: true,
  showCopyButton: true,
  showFullscreenButton: false,
  showLineNumbers: true,
  foldGutter: true,
  editable: false,
  placeholder: 'No JSON data',
  prettify: true,
  indent: 2,
})

const emit = defineEmits<{
  change: [content: string]
  copy: [content: string]
  fullscreenToggle: [fullscreen: boolean]
}>()

const fullscreen = ref(false)
const codeMirrorRef = ref<HTMLDivElement | null>(null)

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

const formattedSize = computed(() => {
  const bytes = new Blob([formattedJson.value]).size
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
})

const { setCodeMirrorContent } = useCodeMirror({
  codeMirrorRef,
  content: formattedJson,
  language: 'json',
  readOnly: !props.editable,
  lineNumbers: props.showLineNumbers,
  forceFoldGutter: props.foldGutter,
  placeholder: props.placeholder,
  onChange: (content: string) => {
    emit('change', content)
  },
})

const toggleFullscreen = () => {
  fullscreen.value = !fullscreen.value
  emit('fullscreenToggle', fullscreen.value)
}

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(formattedJson.value)
    emit('copy', formattedJson.value)
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
  }
}

// JSON 데이터나 content가 바뀔 때 코드미러 내용 갱신
watch(formattedJson, (newValue) => {
  setCodeMirrorContent(newValue)
})

// 데이터 변경 시 전체화면 모드 해제
watch(
  () => [props.data, props.content],
  () => {
    if (fullscreen.value) {
      fullscreen.value = false
    }
  },
)
</script>

<style scoped>
.scalar-json-viewer {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--scalar-border-color);
  border-radius: var(--scalar-radius);
  background: var(--scalar-background-1);
  overflow: hidden;
  height: 400px;
}

.scalar-json-viewer--fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  border-radius: 0;
  height: 100vh;
}

.scalar-json-viewer__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-bottom: 1px solid var(--scalar-border-color);
  background: var(--scalar-background-2);
  min-height: 40px;
  flex-shrink: 0;
}

.scalar-json-viewer__info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.scalar-json-viewer__title {
  font-size: var(--scalar-small);
  font-weight: var(--scalar-semibold);
  color: var(--scalar-color-1);
}

.scalar-json-viewer__size {
  font-size: var(--scalar-mini);
  color: var(--scalar-color-2);
  padding: 2px 6px;
  background: var(--scalar-background-3);
  border-radius: var(--scalar-radius-lg);
}

.scalar-json-viewer__actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 새로 추가한 버튼 스타일 */
.scalar-json-viewer__btn {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  background: transparent;
  border: none;
  padding: 4px;
  border-radius: var(--scalar-radius);
  cursor: pointer;
}

.scalar-json-viewer__btn:hover {
  background: var(--scalar-background-hover);
}

.scalar-json-viewer__btn-icon {
  width: 16px;
  height: 16px;
  color: var(--scalar-color-1);
}

.scalar-json-viewer__content {
  flex: 1;
  overflow: auto;
  background: var(--scalar-background-1);
}

.scalar-json-viewer__editor {
  height: 100%;
  width: 100%;
}

.scalar-json-viewer__editor :deep(.cm-editor) {
  height: 100%;
  font-family: var(--scalar-font-code, 'Monaco', 'Menlo', monospace);
  font-size: 13px;
  line-height: 1.5;
}

.scalar-json-viewer__editor :deep(.cm-content) {
  padding: 12px;
}

.scalar-json-viewer__editor :deep(.cm-focused) {
  outline: none;
}

/* Custom scroll styling */
.custom-scroll {
  scrollbar-width: thin;
  scrollbar-color: var(--scalar-color-3) transparent;
}

.custom-scroll::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.custom-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scroll::-webkit-scrollbar-thumb {
  background-color: var(--scalar-color-3);
  border-radius: 4px;
  border: 2px solid transparent;
  background-clip: content-box;
}

.custom-scroll::-webkit-scrollbar-thumb:hover {
  background-color: var(--scalar-color-2);
}
</style>
