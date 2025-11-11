import type { User } from '@/types'
import { BaseModel } from '@/models/base.model'

export class UserModel extends BaseModel implements User {
  id: number
  email: string
  name: string
  role: User['role']
  avatar: string

  constructor(data: User) {
    super(data)
    this.init(data)
  }
}