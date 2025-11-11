import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import DocumentUploaderPlugin from './plugins/document-uploader'

createApp(App)
  .use(DocumentUploaderPlugin)
  .mount('#app')
