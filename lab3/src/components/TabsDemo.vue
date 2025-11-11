<template>
  <div class="space-y-6">
    <section>
      <h2 class="text-lg font-semibold mb-2">Underline variant</h2>
      <Tabs v-model="current" variant="underline">
        <Tab title="Профіль" slug="profile">Вміст профілю...</Tab>
        <Tab title="Налаштування" slug="settings">Форма налаштувань...</Tab>
        <Tab title="Контакти" slug="contacts">Контактна інформація...</Tab>
      </Tabs>
    </section>

    <section>
      <h2 class="text-lg font-semibold mb-2">Pills variant</h2>
      <Tabs v-model="current2" variant="pills">
        <Tab title="Профіль" slug="profile">Вміст профілю...</Tab>
        <Tab title="Налаштування" slug="settings">Форма налаштувань...</Tab>
        <Tab title="Контакти" slug="contacts">Контактна інформація...</Tab>
      </Tabs>
    </section>

    <section>
      <h2 class="text-lg font-semibold mb-2">Boxed variant</h2>
      <Tabs v-model="current3" variant="boxed">
        <Tab title="Огляд" slug="overview">Огляд контенту...</Tab>
        <Tab title="Деталі" slug="details">Детальний опис...</Tab>
        <Tab title="Логи" slug="logs">Журнали подій...</Tab>
      </Tabs>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Tabs from './Tabs.vue'
import Tab from './Tab.vue'

const current = ref('profile')
const current2 = ref('settings')
const current3 = ref('overview')
</script>
