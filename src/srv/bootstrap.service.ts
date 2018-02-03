import { apiService } from '@/srv/api.service'
import { store } from '@/store'

class BootstrapService {
  private initPromise?: Promise<void>

  async init (): Promise<void> {
    if (!this.initPromise) this.initPromise = this.doInit()
    return this.initPromise
  }

  private async doInit (): Promise<void> {
    const schema = await apiService.getSchema()
    store.commit('setSchema', schema)
  }
}

export const bootstrapService = new BootstrapService()
