<template>
  <div v-if="collection">
    <md-table
      v-model="items"
      :md-sort.sync="currentSort" :md-sort-order.sync="currentSortOrder" :md-sort-fn="customSort"
      md-fixed-header
      @md-selected="onSelect"
    >
      <md-table-toolbar>
        <md-button class="md-raised md-primary"><md-icon>add</md-icon> Create</md-button>
        <md-button class="md-raised md-primary" :disabled="!selected"><md-icon>edit</md-icon> Edit</md-button> &nbsp; &nbsp;
        <md-button class="md-raised md-accent" :disabled="!selected"><md-icon>delete</md-icon> Delete</md-button> &nbsp; &nbsp;

        <md-field md-clearable class="md-toolbar-section-end">
          <md-input placeholder="Search..." data-model1="search" data-input1="searchOnTable" />
        </md-field>
      </md-table-toolbar>

      <md-table-empty-state
        md-label="Nothing found"
        :md-description="`No user found for this 'search' query. Try a different search term or create a new user.`"
      >
        <md-button class="md-primary md-raised" data-click="newUser">Create New User</md-button>
      </md-table-empty-state>

      <md-table-row
        slot="md-table-row"
        slot-scope="{ item }"
        :class1="getClass(item)"
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
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop, Watch } from "vue-property-decorator"
import { Route } from "vue-router";
import { apiService, Collection } from "../srv/api.service"

@Component({
  props: {
    items2: [],
  },
})
export default class CollectionPage extends Vue {
  get collection (): Collection {
    return this.$store.getters.getCollectionByName(this.$route.params['collectionName'])
  }

  items: any[] = []

  currentSort = 'id'
  currentSortOrder = 'desc'

  selected = {}

  getClass (_ref) {
    var id = _ref.id
    return {
      "md-primary": id === 2,
      "md-accent": id === 3
    }
  }

  onSelect (item) {
    this.selected = item
  }

  async clickMe () {
    this.items = await apiService.getItems(this.collection.name)
  }

  async mounted () {
    this.init(this.$route.params['collectionName'])
  }

  async init (collectionName: string) {
    console.log('init: ' + collectionName)
    this.items = await apiService.getItems(collectionName)
  }

  /*@Watch('$route')
  onRouteChanged (val: string, oldVal: string) {
    console.log('onRouteChanged', val)
  }*/

  beforeRouteUpdate (to: Route, from: Route, next: Function): void {
    console.log('beforeRouteUpdate')
    this.init(to.params['collectionName']) // async
    next()
  }

  beforeRouteEnter (to: Route, from: Route, next: Function): void {
    console.log('beforeRouteEnter')
    // this.getItems()
    next()
  }

  beforeRouteLeave () {
    console.log('beforeRouteLeave')
    alert('beforeRouteLeave')
  }

  customSort (value) {
    return value.sort((a, b) => {
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
