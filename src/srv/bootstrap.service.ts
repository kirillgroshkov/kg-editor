import { memo } from '@/decorators/memo.decorator'
import { env } from '@/environment/environment'
import { apiService } from '@/srv/api.service'
import { store } from '@/store'

class BootstrapService {
  @memo()
  async init (): Promise<void> {
    console.log(env())
    const schema = await apiService.getSchema()
    store.commit('setSchema', schema)
  }
}

export const bootstrapService = new BootstrapService()
