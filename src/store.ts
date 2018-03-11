import { Dialog } from '@/srv/dialog.service'
import { AppSchema, SchemaType } from '@/srv/schema.service'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export interface State {
  ghostMode: boolean
  title: string
  project: string
  snackbarText: string
  dialog: Dialog
  schema: AppSchema
  activeCollection: string
  items: { [collectionName: string]: any[] }
}

export const store = new Vuex.Store<State>({
  state: {
    ghostMode: false,
    title: 'Home',
    project: 'innocent',
    snackbarText: '',
    dialog: false as any,
    schema: { collections: [], types: [] },
    activeCollection: '',
    items: {},
  },

  getters: {
    getCollectionByName: (state: State) => (name: string) => {
      return state.schema.collections.find(c => c.name === name)
    },

    getTypeByName: (state: State) => (name: string): SchemaType | undefined => {
      return state.schema.types.find(c => c.name === name)
    },

    getItems: (state: State) => (collectionName: string) => {
      return state.items[collectionName]
    },

    getItem: (state: State) => (collectionName: string, itemId: string) => {
      return (state.items[collectionName] || []).find(item => item.id === itemId)
    },

    isSnackbarActive: (state: State) => () => {
      return !!state.snackbarText
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

    setItems (state: State, data: { collectionName: string; items: any[] }): void {
      state.items = {
        ...state.items,
        [data.collectionName]: data.items,
      }
    },

    deleteItem (state: State, data: { collectionName: string; id: string }): void {
      state.items = {
        ...state.items,
        [data.collectionName]: state.items[data.collectionName].filter(i => i.id !== data.id),
      }
    },

    setSnackbarText (state: State, txt: string): void {
      state.snackbarText = txt
    },

    setGhost (state: State, ghostMode = true): void {
      state.ghostMode = ghostMode
    },

    setDialog (state: State, dialog?: Dialog): void {
      state.dialog = dialog || (false as any)
    },
  },
})
