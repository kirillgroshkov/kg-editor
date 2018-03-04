import { store } from '@/store'
import { Deferred, promiseUtil } from '@/util/promise.util'

export interface Dialog {
  title?: string
  content?: string
  textOk?: string
  textCancel?: string
}

class DialogService {
  private dialogDeferred?: Deferred<boolean>

  async dialog (d: Dialog): Promise<boolean> {
    this.dialogDeferred = promiseUtil.defer<boolean>()

    store.commit('setDialog', d)

    return this.dialogDeferred.promise
  }

  dialogResolve (res: boolean): void {
    if (this.dialogDeferred) {
      store.commit('setDialog')
      this.dialogDeferred.resolve(res)
      this.dialogDeferred = undefined
    }
  }
}

export const dialogService = new DialogService()
