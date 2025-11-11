<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { Product } from '@/types'
import serviceProvider from '@/services'

const router = useRouter()
const products = ref<Product[]>([])
const loading = ref<boolean>(false)
const error = ref<string>('')

async function fetchProducts() {
  try {
    loading.value = true
    products.value = await serviceProvider.getProductsService().get({ limit: 20, offset: 0 })
  } catch (e: any) {
    console.error(e)
    error.value = e?.message || 'Failed to load products'
  } finally {
    loading.value = false
  }
}

function openProduct(p: Product) {
  router.push({ name: 'product-details', params: { id: p.id } })
}

onMounted(fetchProducts)
</script>

<template>
  <main class="container mx-auto p-6">
    <h1 class="text-2xl font-bold mb-4 text-gray-200">Products</h1>
    <p v-if="error" class="text-red-400 mb-4">{{ error }}</p>
    <div v-if="loading">Loading...</div>
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="p in products"
        :key="p.id"
        class="rounded-lg border border-gray-700 bg-gray-900 overflow-hidden hover:shadow"
      >
        <img v-if="p.images?.length" :src="p.images[0]" alt="image" class="w-full h-48 object-cover" />
        <div class="p-4">
          <div class="font-semibold text-gray-100">{{ p.title }}</div>
          <div class="text-sm text-gray-400">{{ p.category?.name }}</div>
          <div class="mt-2 text-green-300 font-medium">${{ p.price }}</div>
          <button class="mt-3 px-3 py-2 bg-blue-600 text-white rounded" @click="openProduct(p)">
            View details
          </button>
        </div>
      </div>
    </div>
  </main>
  
</template>