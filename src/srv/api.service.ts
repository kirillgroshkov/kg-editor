import { env } from '@/environment/environment'
import { FetchService, fetchService } from '@/srv/fetch.service'
import { AppSchema } from '@/srv/schema.service'
import { stringUtil } from '@/srv/string.util'
import { store } from '@/store'

class ApiService extends FetchService {
  async fetch<T> (method: string, _url: string, _opt: RequestInit = {}): Promise<T> {
    const url = `${env().apiUrl}/${store.state.project}${_url}`
    return super.fetch<T>(method, url, _opt)
  }

  async getSchema (): Promise<AppSchema> {
    const s = await this.get<AppSchema>(`/schema`)
    this.completeSchema(s)
    return s
  }

  // mutates
  private completeSchema (s: AppSchema): void {
    s.collections.forEach(c => {
      Object.assign(c, {
        label: c.label || stringUtil.capitalizeFirstLetter(c.name),
        icon: c.icon || 'collections',
      })

      c.fields.forEach(f => {
        if (f.name === 'id') {
          Object.assign(f, {
            type: 'id',
            label: 'id',
            maxLength: f.maxLength || 16,
          })
        }

        Object.assign(f, {
          type: f.type || 'string',
          label: f.label || stringUtil.capitalizeFirstLetter(f.name),
        })
      })
    })
  }

  async getItems<T> (collectionName: string): Promise<T[]> {
    const items = await this.get<T[]>(`/data/${collectionName}`)

    /*const items = [
      { id: '1' + collectionName, lang: 'en', metaTitle: 'metaTitl', metaDescription: 'metaDescr', pub: true, content: 'la-la-la!' },
      { id: '2', lang: 'en', metaTitle: 'metaTitl2', metaDescription: 'metaDescr2', pub: true, content: 'la-la-la2!' },
      { id: '3', lang: 'en', metaTitle: 'metaTitl3', metaDescription: 'metaDescr3', pub: true, content: 'la-la-la3!' },
      { id: '4', lang: 'en', metaTitle: 'metaTitl4', metaDescription: 'metaDescr4', pub: true, content: 'la-la-la4!' },
    ] as any*/

    store.commit('setItems', {
      collectionName,
      items,
    })

    return items
  }

  async saveItem (collectionName: string, item: any): Promise<void> {
    const r = await this.put(`/data/${collectionName}`, {
      body: item,
    })
    console.log('resp!', r)
  }

  async deleteItem (collectionName: string, itemId: string): Promise<void> {
    const r = await this.delete(`/data/${collectionName}/${itemId}`)
    console.log('resp!', r)
  }
}

export const apiService = new ApiService()
