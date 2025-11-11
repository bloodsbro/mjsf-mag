import type { App } from 'vue'
import DocumentUploader from './DocumentUploader.vue'

export { DocumentUploader }

export default {
  install(app: App) {
    app.component('DocumentUploader', DocumentUploader)
  },
}