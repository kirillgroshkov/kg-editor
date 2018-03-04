<template>
  <md-app>
    <md-app-toolbar class="md-primary">
      <span class="md-title">{{ $store.state.title }}</span>
    </md-app-toolbar>

    <md-app-drawer md-permanent="full" md-fixed1="true">
      <md-toolbar class="md-transparent" md-elevation="0">Collections</md-toolbar>

      <md-list>
        <md-list-item :to="`/`">
          <md-icon>home</md-icon>
          <span class="md-list-item-text">Home</span>
        </md-list-item>

        <md-list-item
          v-for="c in $store.state.schema.collections" :key="c.name"
          @click="openCollection(c)"
          :to="`/collection/${c.name}`"
        >
          <md-icon>{{ c.icon }}</md-icon>
          <span class="md-list-item-text">{{ c.label }}</span>
        </md-list-item>
      </md-list>
    </md-app-drawer>

    <md-app-content class="md-layout">
      <router-view></router-view>
    </md-app-content>
  </md-app>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Collection } from '../srv/schema.service';

@Component
export default class LayoutComponent extends Vue {
  get title (): string {
    return this.$store.state.title
  }

  async mounted () {
    // const schema = await apiService.getSchema()
    // this.collections = schema.collections
  }

  openCollection (c: Collection): void {
    this.$store.commit('setActiveCollection', c.name)
    this.$store.commit('extendState', {title: c.label})
  }
}
</script>

<style lang="scss" scoped>
  .page-container {
    // border: 5px solid red;
    // min-height: 800px;
  }

  .md-app {
    min-height: 100vh;
    // display: none;
    // max-height: 400px;
    border: 1px solid rgba(#000, .12);
  }

  .md-app-content {
    // min-height: 100vh;
  }

  .md-drawer {
    // width: 230px;
    width: 180px;
    // max-width: calc(100vw - 325px);
  }
</style>
