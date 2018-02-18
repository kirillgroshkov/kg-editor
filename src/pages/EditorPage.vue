<template>
  <pre v-if="loading">{{loading}}</pre>
  <div v-else>
    <md-button class="md-raised md-primary" @click="onSave"><md-icon>save</md-icon> Save</md-button>
    <md-button class="md-raised md-transparent" @click="onCancel"><md-icon>cancel</md-icon> Cancel</md-button>

    <form novalidate class="md-layout" @submit.prevent="onSubmit">
      <component
        v-for="f in fields" :key="f.name"
        v-bind:is="getFieldComponent(f.type)"
        :field="f" :item="item"/>
    </form>
    {{ item }}
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { router } from '../router';
import { apiService } from "../srv/api.service"
import { Collection, Field, schemaService } from "../srv/schema.service"

@Component
export default class EditorPage extends Vue {
  loading = 'loading...'

  get collection (): Collection {
    return this.$store.getters.getCollectionByName(this.$route.params['collectionName'])
  }

  get fields (): Field {
    const type = this.collection.type
    return this.$store.getters.getTypeByName(type).fields
  }

  get itemId (): string {
    return this.$route.params['itemId']
  }

  get newItem (): boolean {
    return this.itemId === 'new'
  }

  item: any = null

  getFieldComponent (type: string) {
    return schemaService.getFieldComponent(type)
  }

  async mounted () {
    this.loading = 'loading...'

    // console.log('mounted! ' + this.itemId)
    if (this.newItem) {
      this.item = {} // tada: put default values for each field
    } else {
      this.item = this.$store.getters.getItem(this.collection.name, this.itemId)
      if (!this.item) {
        await apiService.getItems(this.collection.name)
        this.item = this.$store.getters.getItem(this.collection.name, this.itemId)
        if (!this.item) alert('item not found!')
      }
    }

    this.loading = ''
  }

  onCancel () {
    router.push(`/collection/${this.collection.name}`)
  }

  async onSave () {
    this.loading = 'saving...'

    // router.push(`/collection/${this.collection.name}`)
    console.log('saving', JSON.stringify(this.item, null, 2))
    await apiService.saveItem(this.collection.name, this.item)
    // alert('saved!')
    router.push(`/collection/${this.collection.name}`)
  }

  onSubmit () {
    alert('onSubmit')
  }
}
</script>

<style lang="scss" scoped>
  form {
    max-width: 790px;
  }
  .short {
    width: 400px;
    max-width: 400px;
  }
</style>
