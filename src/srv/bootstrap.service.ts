import { memo } from '@/decorators/memo.decorator'
import { initProgressDecorator, Progress } from '@/decorators/progress.decorator'
import { env, logEnvironment } from '@/environment/environment'
import { app } from '@/main'
import { apiService } from '@/srv/api.service'
import { schemaService } from '@/srv/schema.service'
import { store } from '@/store'
import { mousetrapUtil } from '@/util/mousetrap.util'

class BootstrapService {
  @memo()
  async init (): Promise<void> {
    logEnvironment()

    this.initDecorators()

    await this.appInit()

    mousetrapUtil.bind({
      'up up down down left right left right b a enter': () => alert('konami')
    })
  }

  @Progress()
  private async appInit (): Promise<void> {
    // await new Promise(r => setTimeout(r, 10000))
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

  private initDecorators (): void {
    initProgressDecorator({
      beforeFn () {
        store.commit('setGhost')
        app.$Progress.start()
      },
      okFn (r) {
        store.commit('setGhost', false)
        let cls: string = r.target && r.target.constructor && r.target.constructor.name
        if (cls) cls += '.'
        let args: string = (r.args && r.args.length) ? JSON.stringify(r.args) + ' ' : ''
        console.log(`@${r.decoratorName} ${cls}${r.propertyKey}() ${args}took ${r.millis} ms`)
        app.$Progress.finish()
      },
      errorFn (err) {
        store.commit('setGhost', false)
        app.$Progress.fail()
        alert(JSON.stringify(err, undefined, 2))
        return Promise.reject(err)
      },
    })
  }
}

export const bootstrapService = new BootstrapService()
