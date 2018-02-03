import { AppSchema } from '@/srv/api.service'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export interface State {
  title: string
  schema: AppSchema
  activeCollection: string
}

export const store = new Vuex.Store<State>({
  state: {
    title: 'Home',
    schema: { collections: [] },
    activeCollection: '',
  },

  getters: {
    getCollectionByName: (state: State) => (name: string) => {
      return state.schema.collections.find(c => c.name === name)
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
  },
})


