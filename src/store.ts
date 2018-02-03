import { AppSchema } from '@/srv/api.service'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export interface State {
  title: string
  schema: AppSchema
  activeCollection: string
  items: { [collectionName: string]: any[] }
}

export const store = new Vuex.Store<State>({
  state: {
    title: 'Home',
    schema: { collections: [] },
    activeCollection: '',
    items: {},
  },

  getters: {
    getCollectionByName: (state: State) => (name: string) => {
      return state.schema.collections.find(c => c.name === name)
    },

    getItems: (state: State) => (collectionName: string) => {
      return state.items[collectionName] || []
    },

    getItem: (state: State) => (collectionName: string, itemId: string) => {
      return (state.items[collectionName] || []).find(item => item.id === itemId)
    },
  },

  mutations: {
    extendState (state: State, extension: Partial<State>): void {
      Object.assign(state, extension)
    },

    replaceState (state: State, replacement: State): void {
      state = replacement
    },

    setSchema (state: State, schema: AppSchema): void {
      state.schema = schema
    },

    setActiveCollection (state: State, activeCollection: string): void {
      state.activeCollection = activeCollection
    },

    setItems (state: State, data: {collectionName: string, items: any[]}): void {
      state.items = {
        ...state.items,
        [data.collectionName]: data.items,
      }
      /*state.items[data.collectionName] = [
        ...state.items[data.collectionName] || [],
        ...data.items,
      ]*/
    },
  },
})
