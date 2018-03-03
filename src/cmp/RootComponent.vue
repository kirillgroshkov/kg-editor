<template>
  <div>
    <vue-progress-bar></vue-progress-bar>

    <pre v-if="loading">{{loading}}</pre>

    <LayoutComponent v-else></LayoutComponent>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import LayoutComponent from '@/cmp/LayoutComponent.vue'
import { bootstrapService } from '../srv/bootstrap.service';

@Component({
  components: {
    LayoutComponent,
  },
})
export default class RootComponent extends Vue {
  loading = 'loading...'

  async mounted () {
    await bootstrapService.init()
    this.loading = ''
  }
}
</script>

<style lang="scss" scoped>

</style>
