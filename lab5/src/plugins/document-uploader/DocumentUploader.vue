<script setup lang="ts">
import { ref, computed, onBeforeUnmount, defineProps, defineEmits } from 'vue'

type PreparedDocument = {
  type: string
  icon: string
  name: string
}

const props = defineProps<{
  modelValue: File[]
  documents?: PreparedDocument[]
  maxFiles?: number
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: File[]): void
  (e: 'remove-document', index: number): void
}>()

const dragOver = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)

const maxFiles = computed(() => props.maxFiles ?? 10)
const files = computed<File[]>({
  get: () => props.modelValue || [],
  set: (val) => emit('update:modelValue', val),
})

// Track created object URLs for cleanup
const objectUrls = ref<Map<File, string>>(new Map())

function getObjectUrl(file: File) {
  if (!objectUrls.value.has(file)) {
    objectUrls.value.set(file, URL.createObjectURL(file))
  }
  return objectUrls.value.get(file) as string
}

function revokeUrl(file: File) {
  const url = objectUrls.value.get(file)
  if (url) {
    URL.revokeObjectURL(url)
    objectUrls.value.delete(file)
  }
}

function canAddMore(countToAdd = 1) {
  return files.value.length + countToAdd <= maxFiles.value
}

function addFiles(incoming: FileList | File[]) {
  const arr = Array.from(incoming)
  if (arr.length === 0) return

  const remaining = maxFiles.value - files.value.length
  const toAdd = arr.slice(0, Math.max(0, remaining))
  if (toAdd.length === 0) return

  const next = files.value.concat(toAdd)
  emit('update:modelValue', next)
}

function onInputChange(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files) {
    addFiles(target.files)
    target.value = ''
  }
}

function onDrop(e: DragEvent) {
  e.preventDefault()
  dragOver.value = false
  if (e.dataTransfer?.files) {
    addFiles(e.dataTransfer.files)
  }
}

function onDragOver(e: DragEvent) {
  e.preventDefault()
  dragOver.value = true
}

function onDragLeave() {
  dragOver.value = false
}

function removeUploaded(index: number) {
  const file = files.value[index]
  if (file) revokeUrl(file)
  const next = files.value.slice()
  next.splice(index, 1)
  emit('update:modelValue', next)
}

function removePrepared(index: number) {
  emit('remove-document', index)
}

function openFileDialog() {
  inputRef.value?.click()
}

onBeforeUnmount(() => {
  for (const url of objectUrls.value.values()) {
    URL.revokeObjectURL(url)
  }
  objectUrls.value.clear()
})
</script>

<template>
  <div class="uploader">
    <div
      class="dropzone"
      :class="{ 'is-over': dragOver, 'is-disabled': !canAddMore() }"
      @click="canAddMore() && openFileDialog()"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @drop="onDrop"
    >
      <input
        ref="inputRef"
        type="file"
        multiple
        class="file-input"
        @change="onInputChange"
      />
      <div class="dropzone-content">
        <div class="icon">📄</div>
        <div>
          <div class="title">Перетягніть файли сюди або натисніть</div>
          <div class="hint">Максимум {{ maxFiles }} файлів</div>
        </div>
      </div>
    </div>

    <div v-if="(documents && documents.length) || files.length" class="grid">
      <!-- Prepared documents -->
      <div v-for="(doc, idx) in documents" :key="'prepared-' + idx" class="card prepared">
        <div class="thumb prepared-thumb">
          <span class="prepared-icon">{{ doc.icon }}</span>
        </div>
        <div class="meta">
          <div class="name">{{ doc.name }}</div>
          <div class="type">{{ doc.type }}</div>
        </div>
        <button class="remove" @click="removePrepared(idx)" title="Видалити">✕</button>
      </div>

      <!-- Uploaded files -->
      <div v-for="(file, idx) in files" :key="'file-' + idx" class="card">
        <div class="thumb">
          <img :src="getObjectUrl(file)" alt="preview" />
        </div>
        <div class="meta">
          <div class="name">{{ file.name }}</div>
          <div class="type">{{ file.type || '—' }}</div>
        </div>
        <button class="remove" @click="removeUploaded(idx)" title="Видалити">✕</button>
      </div>
    </div>
  </div>
  
</template>

<style scoped>
.uploader {
  display: grid;
  gap: 16px;
}
.dropzone {
  border: 2px dashed #4b5563;
  border-radius: 12px;
  padding: 24px;
  background: rgba(255,255,255,0.03);
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
}
.dropzone.is-over {
  border-color: #60a5fa;
  background: rgba(96,165,250,0.1);
}
.dropzone.is-disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.file-input {
  display: none;
}
.dropzone-content {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #e5e7eb;
}
.dropzone .icon {
  font-size: 32px;
}
.title { font-weight: 600; }
.hint { font-size: 12px; color: #9ca3af; }

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}
.card {
  position: relative;
  border: 1px solid #374151;
  border-radius: 10px;
  overflow: hidden;
  background: #111827;
}
.card.prepared {
  background: #0f172a;
}
.thumb {
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1f2937;
}
.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.prepared-thumb { color: #e5e7eb; font-size: 48px; }
.prepared-icon { font-size: 48px; }
.meta { padding: 12px; color: #e5e7eb; }
.name { font-weight: 600; }
.type { font-size: 12px; color: #9ca3af; }
.remove {
  position: absolute;
  top: 8px;
  right: 8px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 4px 8px;
}
.remove:hover { background: #dc2626; }
</style>