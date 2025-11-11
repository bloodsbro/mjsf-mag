<template>
  <div class="w-full">
    <div :class="tabListClasses">
      <button
        v-for="tab in tabs"
        :key="tab.slug"
        type="button"
        :class="tabItemClasses(tab.slug)"
        @click="setActiveTab(tab.slug)"
      >
        {{ tab.title }}
      </button>
    </div>
    <div class="mt-4">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ref, provide, computed, watch } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  variant: { type: String, default: 'underline', validator: (v) => ['underline', 'pills', 'boxed'].includes(v) },
})
const emit = defineEmits(['update:modelValue', 'change'])

const tabs = ref([]) // [{ title, slug }]
const internalActive = ref('')

const activeSlug = computed(() => (props.modelValue || internalActive.value))

function setActiveTab(slug) {
  if (!slug) return
  if (props.modelValue !== undefined) {
    emit('update:modelValue', slug)
    emit('change', slug)
  } else {
    internalActive.value = slug
    emit('change', slug)
  }
}

function registerTab(meta) {
  const exists = tabs.value.some((t) => t.slug === meta.slug)
  if (!exists) {
    tabs.value.push({ title: meta.title, slug: meta.slug })
    if (!activeSlug.value) {
      // set first tab as active if none
      setActiveTab(meta.slug)
    }
  }
}

function unregisterTab(slug) {
  tabs.value = tabs.value.filter((t) => t.slug !== slug)
  if (activeSlug.value === slug) {
    const first = tabs.value[0]
    setActiveTab(first ? first.slug : '')
  }
}

provide('tabs:register', registerTab)
provide('tabs:unregister', unregisterTab)
provide('tabs:activeSlug', activeSlug)
provide('tabs:setActiveTab', setActiveTab)

watch(() => props.modelValue, (val) => {
  // keep internal in sync if parent controls v-model
  if (val !== undefined) internalActive.value = val
})

const tabListClasses = computed(() => {
  switch (props.variant) {
    case 'pills':
      return 'flex gap-2 bg-gray-100 p-1 rounded-md'
    case 'boxed':
      return 'flex gap-2 border rounded-md p-1'
    case 'underline':
    default:
      return 'flex gap-4 border-b'
  }
})

function tabItemClasses(slug) {
  const active = activeSlug.value === slug
  switch (props.variant) {
    case 'pills':
      return [
        'px-3 py-1.5 text-sm rounded-md',
        active ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50 border'
      ]
    case 'boxed':
      return [
        'px-3 py-1.5 text-sm rounded-md border',
        active ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white text-gray-700 hover:bg-gray-50'
      ]
    case 'underline':
    default:
      return [
        'px-3 py-2 text-sm -mb-px',
        active ? 'border-b-2 border-blue-600 text-blue-700' : 'border-b-2 border-transparent text-white hover:text-blue-700 hover:border-blue-300'
      ]
  }
}
</script>
