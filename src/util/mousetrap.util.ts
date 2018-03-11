import * as Mousetrap from 'mousetrap'

interface MousetrapBind {
  [k: string]: (e: ExtendedKeyboardEvent, combo: string) => any
}

class MousetrapUtil {
  stopCallback (): boolean {
    return false
  }

  bind (bind: MousetrapBind): void {
    Object.keys(bind).forEach(k => {
      Mousetrap.bind(k, (e, c) => {
        bind[k](e, c)
        return false
      })
    })
  }

  unbind (keys: string[]): void {
    keys.forEach(k => Mousetrap.unbind(k))
  }
}

export const mousetrapUtil = new MousetrapUtil()

Mousetrap.prototype.stopCallback = mousetrapUtil.stopCallback
