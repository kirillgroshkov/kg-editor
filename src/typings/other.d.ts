declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

/*
import Vue, { ComponentOptions } from "vue"
import { Store } from 'vuex'
import { State } from '@/store'

declare module "vue/types/options" {

  interface ComponentOptions<V extends Vue> {
    store?: Store<State>;
  }
}

declare module "vue/types/vue" {
  interface Vue {
    $store: Store<State>;
  }
}
*/
