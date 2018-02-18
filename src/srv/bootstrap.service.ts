import { memo } from '@/decorators/memo.decorator'
import { env, logEnvironment } from '@/environment/environment'
import { apiService } from '@/srv/api.service'
import { schemaService } from '@/srv/schema.service'
import { store } from '@/store'

class BootstrapService {
  @memo()
  async init (): Promise<void> {
    logEnvironment()
    try {
      const schema = await apiService.getSchema()
      schemaService.completeSchema(schema)
      store.commit('setSchema', schema)
    } catch (err) {
      if (err && err.response && err.response.status === 401) {
        location.href = `${env().loginUrl}?autoLogin=1&return=${location.href}`
        return
      }
      throw err
    }
  }
}

export const bootstrapService = new BootstrapService()
