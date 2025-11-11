<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import type { Product } from '@/types'
import serviceProvider from '@/services'

const route = useRoute()
const product = ref<Product | null>(null)
const loading = ref<boolean>(false)
const error = ref<string>('')

async function fetchProduct() {
  try {
    loading.value = true
    const id = Number(route.params.id)
    product.value = await serviceProvider.getProductsService().getById(id)
  } catch (e: any) {
    console.error(e)
    error.value = e?.message || 'Failed to load product'
  } finally {
    loading.value = false
  }
}

onMounted(fetchProduct)
</script>

<template>
  <main class="container mx-auto p-6">
    <div v-if="loading">Loading...</div>
    <p v-else-if="error" class="text-red-400">{{ error }}</p>
    <div v-else-if="product" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <img v-if="product.images?.length" :src="product.images[0]" class="w-full h-64 object-cover rounded" />
      </div>
      <div>
        <h1 class="text-3xl font-bold text-gray-100">{{ product.title }}</h1>
        <div class="mt-2 text-gray-400">Category: {{ product.category?.name }}</div>
        <div class="mt-2 text-green-300 font-semibold">${{ product.price }}</div>
        <p class="mt-4 text-gray-300">{{ product.description }}</p>
      </div>
    </div>
  </main>
</template>