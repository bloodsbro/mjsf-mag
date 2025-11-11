import type { App, Plugin } from 'vue'
import type { DefineComponent } from 'vue'

export const DocumentUploader: DefineComponent<{
  modelValue: File[]
  documents?: Array<{ type: string; icon: string; name: string }>
  maxFiles?: number
}>

export const install: (app: App) => void

declare const _default: Plugin
export default _default