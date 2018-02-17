<template>
  <div>
    <pre v-if="loading">loading...</pre>
    <template v-else>
      <div v-if="!items.length">
        <md-empty-state
          md-label="Nothing found"
          :md-description="`No user found for this 'search' query. Try a different search term or create a new user.`"
        >
          <md-button class="md-primary md-raised" :to="`/edit/${collection.name}/new`">Create New Item</md-button>
        </md-empty-state>
      </div>

      <md-table
        v-else
        v-model="items"
        :md-sort.sync="currentSort" :md-sort-order.sync="currentSortOrder" :md-sort-fn="customSort"
        md-fixed-header
        @md-selected="onSelect"
      >
        <md-table-toolbar v-if="items.length">
          <md-button class="md-raised md-primary" :to="`/edit/${collection.name}/new`"><md-icon>add</md-icon> Create</md-button>
          <md-button class="md-raised md-primary" :to="`/edit/${collection.name}/${selected.id}`" :disabled="!selected.id"><md-icon>edit</md-icon> Edit</md-button> &nbsp; &nbsp;
          <md-button class="md-raised md-accent" :disabled="!selected.id" @click="onDelete(selected.id)"><md-icon>delete</md-icon> Delete</md-button> &nbsp; &nbsp;

          <md-field md-clearable class="md-toolbar-section-end">
            <md-input placeholder="Search..." data-model1="search" data-input1="searchOnTable" />
          </md-field>
        </md-table-toolbar>

        <md-table-row
          slot="md-table-row"
          slot-scope="{ item }"
          md-selectable="single"
        >
          <md-table-cell
            v-for="f in collection.fields" :key="f.name"
            :md-label="f.label"
            :md-sort-by="f.name"
            md-numeric
          >
            {{ item[f.name] }}
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
import { apiService, Collection } from "../srv/api.service"

@Component
export default class CollectionPage extends Vue {
  get loading () {
    return !this.$store.getters.getItems(this.collection.name)
  }

  get collection (): Collection {
    return this.$store.getters.getCollectionByName(this.$route.params['collectionName'])
  }

  get items () {
    return this.$store.getters.getItems(this.collection.name) || []
  }

  set items (a) {} // to avoid console error

  // items: any[] = []

  currentSort = 'id'
  currentSortOrder = 'desc'

  selected = {}

  onSelect (item: any) {
    // alert('onSelect' + item)
    this.selected = item || {}
  }

  async onDelete (id: string) {
    await apiService.deleteItem(this.collection.name, id)
    // alert('deleted ' + id)
    await apiService.getItems(this.collection.name)
  }

  async mounted () {
    this.init(this.$route.params['collectionName'])
  }

  async init (collectionName: string) {
    console.log('init: ' + collectionName)
    this.selected = {}
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
</style>
