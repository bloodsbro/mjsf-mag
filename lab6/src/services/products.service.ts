import type { AxiosInstance } from 'axios'
import type { Product } from '@/types'
import type { Readable, Createable, Updateable, Deleteable } from '@/services/types'
import { ProductModel } from '@/models/product.model'

export class ProductsService implements Readable<Product>, Createable<Product>, Updateable<Product>, Deleteable<Product> {
  constructor(public httpClient: AxiosInstance) {}

  async get(params: any): Promise<Product[]> {
    const response = await this.httpClient.get<Product[]>('/products', { params })
    return response.data.map((p) => new ProductModel(p))
  }

  async getById(id: number): Promise<Product> {
    const response = await this.httpClient.get<Product>(`/products/${id}`)
    return new ProductModel(response.data)
  }

  async create(data: Product): Promise<Product> {
    const response = await this.httpClient.post<Product>('/products', data)
    return new ProductModel(response.data)
  }

  async update(id: number, data: Product): Promise<Product> {
    const response = await this.httpClient.put<Product>(`/products/${id}`, data)
    return new ProductModel(response.data)
  }

  async delete(id: number): Promise<Product> {
    const response = await this.httpClient.delete<Product>(`/products/${id}`)
    return new ProductModel(response.data)
  }
}