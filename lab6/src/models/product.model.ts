import type { Product } from '@/types'
import { BaseModel } from '@/models/base.model'

export class ProductModel extends BaseModel implements Product {
  id: number
  title: string
  price: number
  description: string
  images: string[]
  category: Product['category']

  constructor(data: Product) {
    super(data)
    this.init(data)
  }
}