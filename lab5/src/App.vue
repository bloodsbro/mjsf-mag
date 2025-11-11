<script setup lang="ts">
import { ref } from 'vue'
import DocumentUploader from './plugins/document-uploader/DocumentUploader.vue'

// Demo state for DocumentUploader
const files = ref<File[]>([])
const documents = ref([
  { type: 'pdf', icon: '📄', name: 'Contract.pdf' },
  { type: 'image', icon: '🖼️', name: 'Vacation.png' },
  { type: 'docx', icon: '📝', name: 'Resume.docx' },
])

function removePrepared(index: number) {
  documents.value.splice(index, 1)
}
</script>

<template>
  <main>
    <h1>DocumentUploader Demo</h1>
    <p>Спробуйте перетягнути файли або натиснути на зону завантаження.</p>

    <DocumentUploader
      v-model="files"
      :documents="documents"
      :maxFiles="6"
      @remove-document="removePrepared"
    />

    <section class="debug">
      <h2>Стан</h2>
      <div class="row">
        <div>
          <h3>Завантажені файли</h3>
          <ul>
            <li v-for="(f, i) in files" :key="i">{{ f.name }}</li>
          </ul>
        </div>
        <div>
          <h3>Підготовлені документи</h3>
          <ul>
            <li v-for="(d, i) in documents" :key="i">{{ d.name }} ({{ d.type }})</li>
          </ul>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
main {
  display: grid;
  gap: 16px;
  text-align: left;
}
.debug .row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}
h1 { margin: 0; }
h2 { margin: 0; }
h3 { margin: 0; }
ul { margin: 8px 0 0; padding-left: 16px; }
</style>
