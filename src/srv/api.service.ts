import { stringUtil } from '@/srv/string.util'
import { store } from '@/store'

export interface AppSchema {
  collections: Collection[]
}

export interface Collection {
  name: string
  label: string
  icon: string
  folders: boolean
  fields: Field[]
}

export interface Field {
  name: string
  label: string
  type: string
  required: boolean

  minLength?: number
  maxLength?: number
}

class ApiService {
  async getSchema (): Promise<AppSchema> {
    const r = await fetch('http://localhost:3000/schema')
    // await new Promise(r => setTimeout(r, 5000))
    const s = (await r.json()) as AppSchema

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

    return s
  }

  async getItems<T> (collectionName: string): Promise<T[]> {
    const items = [
      { id: '1' + collectionName, lang: 'en', metaTitle: 'metaTitl', metaDescription: 'metaDescr', pub: true, content: 'la-la-la!' },
      { id: '2', lang: 'en', metaTitle: 'metaTitl2', metaDescription: 'metaDescr2', pub: true, content: 'la-la-la2!' },
      { id: '3', lang: 'en', metaTitle: 'metaTitl3', metaDescription: 'metaDescr3', pub: true, content: 'la-la-la3!' },
      { id: '4', lang: 'en', metaTitle: 'metaTitl4', metaDescription: 'metaDescr4', pub: true, content: 'la-la-la4!' },
    ] as any

    store.commit('setItems', {
      collectionName,
      items,
    })

    return items
  }
}

export const apiService = new ApiService()
