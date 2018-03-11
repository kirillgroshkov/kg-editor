<template>
  <div class="md-layout-item md-layout">
    <pre v-if="loading || loadingTxt">loading...</pre>

    <template v-else>
      <div v-if="!items.length" class="md-layout-item md-layout">
        <md-empty-state
          md-label="Nothing found"
          :md-description="`No user found for this 'search' query. Try a different search term or create a new user.`"
        >
          <md-button class="md-primary md-raised" @click="onCreate">Create New Item (⌘→)</md-button>
        </md-empty-state>
      </div>

      <md-table
        v-else
        class="md-layout-item md-layout"
        v-model="items"
        :md-sort.sync="currentSort" :md-sort-order.sync="currentSortOrder" :md-sort-fn="customSort"
        amd-fixed-header
        @md-selected="onSelect"
      >
        <md-table-toolbar v-if="items.length">
          <md-button class="md-raised md-primary" @click="onCreate">Create (⌘→)</md-button>

          <md-field md-clearable class="md-toolbar-section-end" v-if="false">
            <md-input placeholder="Search..." data-model1="search" data-input1="searchOnTable" />
          </md-field>
        </md-table-toolbar>

        <md-table-row
          slot="md-table-row"
          slot-scope="{ item }"
          md-selectable="single"
        >
          <md-table-cell
            v-for="f in fields" :key="f.name"
            :md-label="f.label"
            :md-sort-by="f.name"
            md-numeric
          >
            <template v-if="f.arrayOf">
              <md-chip v-for="arrayItem in getCellContent(f, item)" :key="arrayItem">{{arrayItem}}</md-chip>
            </template>
            <template v-else>{{ getCellContent(f, item) }}</template>
          </md-table-cell>

          <md-table-cell>
            <md-button class="md-icon-button" @click.stop="onDelete(item.id)">
              <md-icon>delete</md-icon>
            </md-button>
          </md-table-cell>
        </md-table-row>
      </md-table>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Route } from "vue-router";
import { Progress } from '../decorators/progress.decorator';
import { router } from '../router';
import { apiService } from "../srv/api.service"
import { Collection, Field, schemaService } from "../srv/schema.service"
import { mousetrapUtil } from '../util/mousetrap.util';

@Component
export default class CollectionPage extends Vue {
  loadingTxt = ''
  currentSort = 'id'
  currentSortOrder = 'desc'

  get loading () {
    return !this.$store.getters.getItems(this.collection.name)
  }

  get collection (): Collection {
    return this.$store.getters.getCollectionByName(this.$route.params['collectionName'])
  }

  get fields (): Field {
    const type = this.collection.type
    return this.$store.getters.getTypeByName(type).fields
  }

  get items () {
    return this.$store.getters.getItems(this.collection.name) || []
  }

  set items (a) {} // to avoid console error

  // items: any[] = []

  getCellContent (f: Field, item: any): string | string[] {
    const c = schemaService.getCellContent(f, item[f.name])!
    if (f.arrayOf) {
      return c.length > 10
        ? [...c.slice(0, 10), '...']
        : [...c]
    }
    return c
  }

  onSelect (item: any) {
    if (!item) return
    // alert('onSelect' + item)
    // this.selected = item || {}
    this.$router.push(`/edit/${this.collection.name}/${item.id}`)

  }

  @Progress()
  async onDelete (id: string) {
    if (!confirm('sure?')) return
    this.$store.commit('deleteItem', {
      collectionName: this.collection.name,
      id,
    })
    // this.loadingTxt = 'deleting...'
    await apiService.deleteItem(this.collection.name, id)
    // alert('deleted ' + id)
    await apiService.getItems(this.collection.name)
    // this.loadingTxt = ''
  }

  onCreate () {
    router.push(`/edit/${this.collection.name}/new`)
  }

  async mounted () {
    this.init(this.$route.params['collectionName'])

    mousetrapUtil.bind({
      // 'command+b': () => this.onCreate(),
      'command+right': () => this.onCreate(),
    })
  }

  destroyed () {
    mousetrapUtil.unbind(['command+b', 'command+right'])
  }

  @Progress()
  async init (collectionName: string) {
    console.log('init: ' + collectionName)
    await apiService.getItems(collectionName)
  }

  /*@Watch('$route')
  onRouteChanged (val: string, oldVal: string) {
    console.log('onRouteChanged', val)
  }*/

  beforeRouteUpdate (to: Route, from: Route, next: Function): void {
    // console.log('beforeRouteUpdate')
    this.init(to.params['collectionName']) // async
    next()
  }

  beforeRouteEnter (to: Route, from: Route, next: Function): void {
    // console.log('beforeRouteEnter')
    // this.getItems()
    next()
  }

  beforeRouteLeave (to: Route, from: Route, next: Function): void {
    // console.log('beforeRouteLeave')
    // alert('beforeRouteLeave')
    next()
  }

  customSort (value: any) {
    return value.sort((a: any, b: any) => {
      const sortBy = this.currentSort

      if (this.currentSortOrder === "desc") {
        return a[sortBy].localeCompare(b[sortBy])
      }

      return b[sortBy].localeCompare(a[sortBy])
    })
  }
}
</script>

<style lang="scss" scoped>
  .md-toolbar-section-end {
    max-width: 200px;
    // background-color: red !important;
  }
  .md-table-content {
    // display: flex !important;
    // height: auto !important;
    // max-height: auto !important;
  }
  .md-chip {
    height: 28px;
    line-height: 28px;
    margin-top: 2px; margin-bottom: 2px;
  }
</style>
