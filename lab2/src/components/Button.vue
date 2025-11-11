<template>
  <button
    :class="[
      baseClasses,
      sizeClasses[size] || sizeClasses.md,
      colorClasses[color] || colorClasses.blue,
      { 'opacity-50 cursor-not-allowed': disabled }
    ]"
    :disabled="disabled"
    @click="onClick"
  >
    <span v-if="icon" class="flex items-center">
      <Icon :name="icon" class="h-5 w-5" />
    </span>
    <span>{{ label }}</span>
  </button>
</template>

<script setup>
import { computed, h } from 'vue'

const props = defineProps({
  label: { type: String, required: true },
  color: { type: String, default: 'blue' },
  size: { type: String, default: 'md' },
  icon: { type: String, default: null },
  disabled: { type: Boolean, default: false },
})

const emit = defineEmits(['click'])

const baseClasses = 'inline-flex items-center gap-2 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors select-none'

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
}

const colorClasses = {
  blue: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
  red: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  green: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
  gray: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-400',
  yellow: 'bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-400',
  purple: 'bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500',
}

function onClick(e) {
  if (props.disabled) return
  emit('click', e)
}

// Simple inline icon component with a few options
const Icon = {
  props: { name: String },
  setup(p) {
    const path = computed(() => {
      switch (p.name) {
        case 'search':
          return 'M11 19a8 8 0 1 1 5.293-14.293l4.5 4.5a1 1 0 0 1-1.414 1.414l-4.5-4.5A8 8 0 0 1 11 19zm0-2a6 6 0 1 0 0-12 6 6 0 0 0 0 12z'
        case 'check':
          return 'M20 6L9 17l-5-5 1.414-1.414L9 14.172 18.586 4.586 20 6z'
        case 'close':
        case 'x':
          return 'M6 6l12 12M6 18L18 6'
        case 'arrow-down':
          return 'M12 4v12m0 0l-6-6m6 6l6-6'
        default:
          return ''
      }
    })

    return () =>
      h(
        'svg',
        {
          xmlns: 'http://www.w3.org/2000/svg',
          fill: 'none',
          viewBox: '0 0 24 24',
          'stroke-width': 2,
          stroke: 'currentColor',
          class: 'h-5 w-5',
        },
        h('path', {
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          d: path.value,
        })
      )
  },
}
</script>