import type { AxiosInstance } from 'axios'
import type { User } from '@/types'
import type { Readable, Createable, Updateable, Deleteable } from '@/services/types'
import { UserModel } from '@/models/user.model'

export class UsersService implements Readable<User>, Createable<User>, Updateable<User>, Deleteable<User> {
  constructor(public httpClient: AxiosInstance) {}

  async get(params: any): Promise<User[]> {
    const response = await this.httpClient.get<User[]>('/users', { params })
    return response.data.map((u) => new UserModel(u))
  }

  async getById(id: number): Promise<User> {
    const response = await this.httpClient.get<User>(`/users/${id}`)
    return new UserModel(response.data)
  }

  async create(data: User): Promise<User> {
    const response = await this.httpClient.post<User>('/users', data)
    return new UserModel(response.data)
  }

  async update(id: number, data: User): Promise<User> {
    const response = await this.httpClient.put<User>(`/users/${id}`, data)
    return new UserModel(response.data)
  }

  async delete(id: number): Promise<User> {
    const response = await this.httpClient.delete<User>(`/users/${id}`)
    return new UserModel(response.data)
  }
}