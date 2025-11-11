<template>
  <div ref="containerRef" class="w-full max-w-md">
    <label class="block text-sm font-medium text-white mb-1">{{ label }}</label>
    <div
      class="relative border rounded-md px-2 py-1.5 bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500"
      @click="focusInput"
    >
      <!-- Selected chips for multiple -->
      <div v-if="multiple && selectedArray.length" class="flex flex-wrap gap-1 mb-1">
        <span
          v-for="sel in selectedArray"
          :key="getValue(sel)"
          class="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
        >
          <span>{{ getLabel(sel) }}</span>
          <button type="button" class="text-blue-700 hover:text-blue-900" @click.stop="removeSelected(getValue(sel))">×</button>
        </span>
      </div>

      <!-- Input -->
      <div class="flex items-center gap-2">
        <input
          ref="inputRef"
          type="text"
          class="flex-1 outline-none text-sm placeholder-gray-400 text-black"
          :placeholder="placeholderText"
          :value="inputValue"
          @focus="open"
          @input="onInput"
          @keydown="onKeydown"
        />

        <button v-if="clearable && hasSelection" class="text-gray-500 hover:text-gray-700 text-sm" @click.stop="clearSelection">
          очистити
        </button>

        <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      <!-- Dropdown -->
      <div v-if="isOpen" class="absolute left-0 right-0 z-10 mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
        <ul>
          <li
            v-for="(item, idx) in filteredItems"
            :key="getValue(item)"
            @mouseenter="highlightedIndex = idx"
            @mousedown.prevent="select(item)"
            :class="[
              'px-3 py-2 cursor-pointer flex items-center gap-2',
              idx === highlightedIndex ? 'bg-blue-50' : '',
              isSelected(item) ? 'font-medium text-blue-700' : 'text-gray-700'
            ]"
          >
            <slot name="option" :item="item" :isSelected="isSelected(item)" :isHighlighted="idx === highlightedIndex">
              <span v-if="item.icon" class="h-4 w-4">{{ item.icon }}</span>
              <span>{{ getLabel(item) }}</span>
            </slot>
          </li>

          <li v-if="!filteredItems.length" class="px-3 py-2 text-gray-500">Нічого не знайдено</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount, ref, watch } from 'vue'

const props = defineProps({
  items: { type: Array, required: true },
  modelValue: { type: [Array, String, Number, Object, null], default: null },
  multiple: { type: Boolean, default: false },
  placeholder: { type: String, default: 'Виберіть…' },
  clearable: { type: Boolean, default: true },
  label: { type: String, default: 'Пошук та вибір' },
})

const emit = defineEmits(['update:modelValue', 'change'])

const isOpen = ref(false)
const query = ref('')
const highlightedIndex = ref(0)
const inputRef = ref(null)
const containerRef = ref(null)

const normalized = computed(() => props.items.map((it) => normalizeItem(it)))

const filteredItems = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return normalized.value
  return normalized.value.filter((it) => getLabel(it).toLowerCase().includes(q))
})

const selectedArray = computed(() => {
  if (props.multiple) return Array.isArray(props.modelValue) ? props.modelValue.map((it) => normalizeItem(it)) : []
  return props.modelValue ? [normalizeItem(props.modelValue)] : []
})

const hasSelection = computed(() => selectedArray.value.length > 0)

const inputValue = computed(() => {
  return isOpen.value ? query.value : (!props.multiple && hasSelection.value ? getLabel(selectedArray.value[0]) : '')
})

const placeholderText = computed(() => (props.multiple && hasSelection.value ? '' : props.placeholder))

function open() {
  isOpen.value = true
}

function close() {
  isOpen.value = false
  highlightedIndex.value = 0
}

function focusInput() {
  inputRef.value?.focus()
}

function onInput(e) {
  query.value = e.target.value
  highlightedIndex.value = 0
}

function onKeydown(e) {
  if (!isOpen.value && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
    open()
    return
  }

  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault()
      highlightedIndex.value = Math.min(highlightedIndex.value + 1, filteredItems.value.length - 1)
      break
    case 'ArrowUp':
      e.preventDefault()
      highlightedIndex.value = Math.max(highlightedIndex.value - 1, 0)
      break
    case 'Enter':
      e.preventDefault()
      const item = filteredItems.value[highlightedIndex.value]
      if (item) select(item)
      break
    case 'Escape':
      close()
      break
    case 'Backspace':
      if (props.multiple && !query.value && selectedArray.value.length) {
        removeSelected(getValue(selectedArray.value[selectedArray.value.length - 1]))
      }
      break
  }
}

function select(item) {
  if (props.multiple) {
    const current = Array.isArray(props.modelValue) ? [...props.modelValue] : []
    const val = getValue(item)
    if (!current.some((i) => getValue(normalizeItem(i)) === val)) current.push(item)
    emit('update:modelValue', current)
    emit('change', current)
    query.value = ''
    // keep open for multiple
    inputRef.value?.focus()
  } else {
    emit('update:modelValue', item)
    emit('change', item)
    query.value = ''
    close()
  }
}

function clearSelection() {
  emit('update:modelValue', props.multiple ? [] : null)
  emit('change', props.multiple ? [] : null)
  query.value = ''
  focusInput()
}

function removeSelected(value) {
  if (!props.multiple) return
  const current = Array.isArray(props.modelValue) ? [...props.modelValue] : []
  const next = current.filter((i) => getValue(normalizeItem(i)) !== value)
  emit('update:modelValue', next)
  emit('change', next)
}

function normalizeItem(it) {
  if (typeof it === 'string' || typeof it === 'number') {
    return { label: String(it), value: it }
  }
  // object with label/value/icon support
  return {
    label: it.label ?? String(it.value ?? ''),
    value: it.value ?? it.label,
    icon: it.icon ?? null,
    ...it,
  }
}

function getLabel(it) {
  return normalizeItem(it).label
}

function getValue(it) {
  return normalizeItem(it).value
}

function isSelected(item) {
  const val = getValue(item)
  if (props.multiple) {
    return selectedArray.value.some((i) => getValue(i) === val)
  }
  return selectedArray.value.length ? getValue(selectedArray.value[0]) === val : false
}

function handleClickOutside(e) {
  if (!containerRef.value) return
  if (!containerRef.value.contains(e.target)) {
    close()
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})

watch(() => props.items, () => {
  // reset highlight when items list changes
  highlightedIndex.value = 0
})
</script>

<style scoped>
</style>