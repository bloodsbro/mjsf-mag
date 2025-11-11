# DocumentUploader (Vue 3)

A Vue 3 component and plugin that provides a drag-and-drop document uploader with previews for uploaded files and pre-configured documents.

## Features

- Drag & Drop or click to select files
- Previews for uploaded files using `URL.createObjectURL`
- Previews for prepared documents passed via `documents` prop
- Delete uploaded or prepared items
- `maxFiles` limit for uploads
- Dark-friendly styling
- Global registration via plugin `install(app)`

## Installation

```bash
npm i document-uploader
```

## Usage

```ts
import { createApp } from 'vue'
import App from './App.vue'
import DocumentUploaderPlugin from 'document-uploader'

createApp(App).use(DocumentUploaderPlugin).mount('#app')
```

```vue
<template>
  <DocumentUploader v-model="files" :documents="docs" :maxFiles="5" @remove-document="removePrepared" />
  <pre>{{ files.map(f => f.name) }}</pre>
  <pre>{{ docs }}</pre>
  
</template>

<script setup lang="ts">
import { ref } from 'vue'
const files = ref<File[]>([])
const docs = ref([
  { type: 'pdf', icon: '📄', name: 'Contract.pdf' },
  { type: 'image', icon: '🖼️', name: 'Photo.png' },
])
function removePrepared(index: number) {
  docs.value.splice(index, 1)
}
</script>
```

## Props

- `modelValue: File[]` — selected files (v-model)
- `documents: Array<{ type: string; icon: string; name: string }>` — prepared documents
- `maxFiles: number` — maximum number of files

## Events

- `update:modelValue` — emitted when files change
- `remove-document(index: number)` — emitted to remove a prepared document

## Types

`types` are included via `.d.ts` and support Vue + TS projects.