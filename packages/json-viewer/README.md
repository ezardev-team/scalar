# @scalar/json-viewer

A Vue component for viewing and editing JSON with syntax highlighting powered by CodeMirror.

## Features

- 🎨 **Syntax highlighting** - JSON syntax highlighting using CodeMirror
- 📝 **Editable mode** - Edit JSON content with validation
- 📋 **Copy to clipboard** - Easy copy functionality
- 🖼️ **Fullscreen mode** - View large JSON files in fullscreen
- 📏 **Line numbers** - Optional line numbers display
- 📁 **Folding** - Collapse/expand JSON structures
- 📊 **File size display** - Shows formatted file size
- 🎯 **Modal support** - Display JSON in modal dialogs
- 🔧 **Customizable** - Flexible props for different use cases

## Installation

```bash
npm install @scalar/json-viewer
```

## Usage

### Basic Usage

```vue
<template>
  <ScalarJsonViewer
    :data="jsonData"
    title="My JSON Data"
    :show-line-numbers="true"
    :prettify="true"
  />
</template>

<script setup>
import { ScalarJsonViewer } from '@scalar/json-viewer'

const jsonData = {
  name: 'John Doe',
  age: 30,
  hobbies: ['reading', 'coding', 'swimming']
}
</script>
```

### Editable Mode

```vue
<template>
  <ScalarJsonViewer
    :data="jsonData"
    :editable="true"
    @change="onJsonChange"
  />
</template>

<script setup>
import { ScalarJsonViewer } from '@scalar/json-viewer'

const onJsonChange = (newContent) => {
  console.log('JSON changed:', newContent)
}
</script>
```

### Modal Usage

```vue
<template>
  <button @click="showModal = true">Open JSON</button>
  <ScalarJsonViewerModal
    v-model="showModal"
    :data="jsonData"
    title="JSON Modal"
  />
</template>

<script setup>
import { ref } from 'vue'
import { ScalarJsonViewerModal } from '@scalar/json-viewer'

const showModal = ref(false)
const jsonData = { message: 'Hello World' }
</script>
```

### Global Helper

```js
import { openJsonViewer } from '@scalar/json-viewer'

// Open JSON viewer modal programmatically
openJsonViewer({
  data: { message: 'Hello' },
  title: 'My JSON',
  onCopy: (content) => console.log('Copied:', content),
  onClose: () => console.log('Modal closed')
})
```

## Props

### ScalarJsonViewer

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `any` | `undefined` | JSON data to display as an object |
| `content` | `string` | `undefined` | Raw JSON string to display |
| `title` | `string` | `undefined` | Title for the viewer |
| `showToolbar` | `boolean` | `true` | Whether to show the toolbar |
| `showSize` | `boolean` | `true` | Whether to show file size information |
| `showCopyButton` | `boolean` | `true` | Whether to show copy button |
| `showFullscreenButton` | `boolean` | `false` | Whether to show fullscreen button |
| `showLineNumbers` | `boolean` | `true` | Whether to show line numbers |
| `foldGutter` | `boolean` | `true` | Whether to enable folding |
| `editable` | `boolean` | `false` | Whether the content is editable |
| `placeholder` | `string` | `'No JSON data'` | Placeholder text when content is empty |
| `prettify` | `boolean` | `true` | Whether to format/prettify JSON |
| `indent` | `number` | `2` | Number of spaces for indentation |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `change` | `string` | Emitted when content changes (editable mode) |
| `copy` | `string` | Emitted when content is copied |
| `fullscreenToggle` | `boolean` | Emitted when fullscreen is toggled |

## Development

```bash
# Install dependencies
npm install

# Build the package
npm run build

# Run tests
npm run test

# Run Storybook
npm run dev
```

## License

MIT 