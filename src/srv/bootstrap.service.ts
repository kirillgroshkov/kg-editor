import { apiService } from '@/srv/api.service'
import { store } from '@/store'

class BootstrapService {
  async init (): Promise<void> {
    const schema = await apiService.getSchema()
    store.commit('setSchema', schema)
  }
}

export const bootstrapService = new BootstrapService()
