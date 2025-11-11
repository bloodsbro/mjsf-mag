<script setup>
import { ref } from 'vue'
import Button from './components/Button.vue'
import SearchableDropdown from './components/SearchableDropdown.vue'
import TabsDemo from './components/TabsDemo.vue'

const toast = ref('')
let toastTimer = null
function onClick(name) {
  toast.value = `Натиснуто кнопку: ${name}`
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => (toast.value = ''), 1500)
}

// Dropdown demo data
const fruits = ['Яблуко', 'Банан', 'Апельсин', 'Груша', 'Ківі', 'Манго', 'Виноград']
const iconsData = [
  { label: 'Пошта', value: 'mail', icon: '📧' },
  { label: 'Календар', value: 'calendar', icon: '📅' },
  { label: 'Налаштування', value: 'settings', icon: '⚙️' },
]
const languages = ['JavaScript', 'TypeScript', 'Python', 'Go', 'Rust', 'Java', 'C#', 'PHP']

const singleSelection = ref(null)
const iconSelection = ref(null)
const multiSelection = ref([])

function displaySelected(value) {
  if (Array.isArray(value)) return value.map((v) => (typeof v === 'object' ? v.label ?? v.value : String(v))).join(', ')
  if (!value) return '—'
  return typeof value === 'object' ? value.label ?? value.value : String(value)
}
</script>

<template>
  <main class="min-h-screen bg-[#242424]">
    <div class="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <header class="space-y-2">
        <h1 class="text-2xl font-bold">Демо компонентів</h1>
        <p class="text-white">Button та SearchableDropdown з Tailwind</p>
      </header>

      <!-- Button Demos -->
      <section class="space-y-4">
        <h2 class="text-xl font-semibold">Button — кольори</h2>
        <div class="flex flex-wrap gap-3">
          <Button label="Blue" color="blue" icon="check" @click="onClick('Blue')" />
          <Button label="Red" color="red" icon="x" @click="onClick('Red')" />
          <Button label="Green" color="green" icon="check" @click="onClick('Green')" />
          <Button label="Gray" color="gray" @click="onClick('Gray')" />
          <Button label="Yellow" color="yellow" icon="search" @click="onClick('Yellow')" />
          <Button label="Purple" color="purple" @click="onClick('Purple')" />
        </div>

        <h2 class="text-xl font-semibold">Button — розміри</h2>
        <div class="flex flex-wrap items-center gap-3">
          <Button label="Small" size="sm" color="blue" />
          <Button label="Medium" size="md" color="blue" />
          <Button label="Large" size="lg" color="blue" icon="search" />
        </div>
      </section>

      <!-- SearchableDropdown Demos -->
      <section class="space-y-6">
        <h2 class="text-xl font-semibold">SearchableDropdown — одиночний вибір</h2>
        <SearchableDropdown
          v-model="singleSelection"
          :items="fruits"
          placeholder="Оберіть фрукт…"
          label="Фрукти"
        />
        <p class="text-sm text-white">Вибрано: <span class="font-medium">{{ displaySelected(singleSelection) }}</span></p>

        <h2 class="text-xl font-semibold">SearchableDropdown — кастомні варіанти</h2>
        <SearchableDropdown
          v-model="iconSelection"
          :items="iconsData"
          placeholder="Оберіть елемент…"
          label="Елементи з іконками"
        >
          <template #option="{ item, isSelected }">
            <span class="inline-flex items-center gap-2">
              <span class="h-4 w-4">{{ item.icon }}</span>
              <span :class="isSelected ? 'font-medium text-blue-700' : ''">{{ item.label }}</span>
            </span>
          </template>
        </SearchableDropdown>
        <p class="text-sm text-text-white">Вибрано: <span class="font-medium">{{ displaySelected(iconSelection) }}</span></p>

        <h2 class="text-xl font-semibold">SearchableDropdown — мульти-вибір</h2>
        <SearchableDropdown
          v-model="multiSelection"
          :items="languages"
          multiple
          placeholder="Оберіть мови…"
          label="Мови програмування"
        />
        <p class="text-sm text-text-white">Вибрано: <span class="font-medium">{{ displaySelected(multiSelection) }}</span></p>
      </section>

      <!-- Tabs Demos -->
      <section class="space-y-6">
        <h2 class="text-xl font-semibold">Tabs — демо варіантів</h2>
        <TabsDemo />
      </section>
    </div>
  </main>

  <!-- Toast for click demo -->
  <div v-if="toast" class="fixed bottom-4 right-4 bg-black text-white text-sm px-3 py-2 rounded shadow">{{ toast }}</div>
</template>

<style scoped>
</style>
