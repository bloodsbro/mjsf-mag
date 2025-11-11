<template>
  <div v-if="isActive">
    <slot />
  </div>
</template>

<script setup>
import { inject, onMounted, onBeforeUnmount, computed } from 'vue'

const props = defineProps({
  title: { type: String, required: true },
  slug: { type: String, required: true },
})

const register = inject('tabs:register')
const unregister = inject('tabs:unregister')
const activeSlug = inject('tabs:activeSlug')

onMounted(() => {
  register?.({ title: props.title, slug: props.slug })
})

onBeforeUnmount(() => {
  unregister?.(props.slug)
})

const isActive = computed(() => {
  return activeSlug?.value === props.slug
})
</script>
