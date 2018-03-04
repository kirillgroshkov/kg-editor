<template>
  <pre v-if="loading">{{loading}}</pre>
  <div v-else class="md-layout-item md-alignment-top-left1">
    <div class="md-layout-item md-layout buttons">
      <md-button class="md-raised md-primary md-layout-item1"
                 style="margin-left: 0;"
                 :disabled="!saveEnabled"
                 @click="onSave(true)"
      >Save (⌘+S)</md-button>

      <md-button class="md-raised md-transparent md-layout-item1"
                 :disabled="!exitEnabled"
                 @click="onExit"
      >Exit (⌘←)</md-button>
    </div>

    <div class="mainEditor">
      <component
        v-bind:is="getFieldComponent(collection.type)"
        :value="item"
        :originalValue="originalItem"
        :forceDirty="forceDirty"
        :field="field"
        :level="0"
        @input="updateItem"
        @valid="updateItemValid"
      />

      <pre v-if="debug" class="debug">item (valid={{valid}}): {{ item }}</pre>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Progress } from '../decorators/progress.decorator';
import { router } from '../router';
import { apiService } from "../srv/api.service"
import { dialogService } from '../srv/dialog.service';
import { Collection, Field, schemaService, SchemaType } from "../srv/schema.service"
import { mousetrapUtil } from '../util/mousetrap.util';
import { objectUtil } from '../util/object.util';

@Component
export default class EditorPage extends Vue {
  loading = 'loading...'
  valid = false
  forceDirty = false
  debug = true

  item: any = null

  // this is what is saved to db
  originalItem: any = null

  get collection (): Collection {
    return this.$store.getters.getCollectionByName(this.$route.params['collectionName'])
  }

  get typeName (): string {
    return this.collection.type
  }

  get type (): SchemaType {
    return this.$store.getters.getTypeByName(this.typeName)
  }

  get field (): Field {
    // create Field based on Collection information we have
    return {
      name: this.collection.type,
      label: this.type.label,
      type: this.collection.type,
      // descr: 'descrrrr',
    }
  }

  get itemId (): string {
    return this.$route.params['itemId']
  }

  get isNewItem (): boolean {
    return this.itemId === 'new'
  }

  get valueChanged (): boolean {
    return !objectUtil.deepEquals(this.item, this.originalItem)
  }

  get saveEnabled (): boolean {
    return !this.$store.state.ghostMode && this.valueChanged && (this.valid || !this.forceDirty)
  }

  get exitEnabled (): boolean {
    return !this.$store.state.ghostMode
  }

  getFieldComponent (type: string) {
    return schemaService.getFieldComponent(type)
  }

  @Progress()
  async mounted () {
    this.loading = 'loading...'

    // console.log('mounted! ' + this.itemId)
    if (this.isNewItem) {
      // this.originalItem = {__original: true}
      this.item = schemaService.getEmptyValueByType(this.collection.type) || {}
      this.originalItem = objectUtil.deepCopy(this.item)
      // console.log('sss', this.item)
    } else {
      this.item = this.$store.getters.getItem(this.collection.name, this.itemId)
      if (!this.item) {
        await apiService.getItems(this.collection.name)
        this.item = this.$store.getters.getItem(this.collection.name, this.itemId)
        if (!this.item) alert('item not found!')
      }
      this.originalItem = objectUtil.deepCopy(this.item)
    }

    this.loading = ''

    mousetrapUtil.bind({
      'command+s': () => this.onSave(),
      'command+x': () => this.onExit(),
      'command+left': () => this.onExit(),
      'esc': () => this.onExit(),
    })
  }

  destroyed () {
    mousetrapUtil.unbind(['command+s', 'command+x', 'command+left', 'esc'])
  }

  async onExit () {
    if (this.valueChanged) {
      const confirm = await dialogService.dialog({
        title: 'Unsaved changes',
        content: 'There are unsaved changes, are you sure you want to leave them?',
        textOk: 'Leave',
        textCancel: 'Stay',
      })
      if (!confirm) return
    }

    if (!this.exitEnabled) return
    this.doExit()
  }

  doExit () {
    router.push(`/collection/${this.collection.name}`)
  }

  async onSave (exit = false) {
    if (!this.saveEnabled) return

    // Validate before saving
    if (!this.valid) {
      this.forceDirty = true
      return
    }

    await this.doSave()
    if (exit) this.doExit()
  }

  @Progress()
  async doSave () {
    console.log('saving', JSON.stringify(this.item, null, 2))
    const _originalItem = objectUtil.deepCopy(this.originalItem)

    try {
      this.originalItem = objectUtil.deepCopy(this.item)
      await apiService.saveItem(this.collection.name, this.item)
      // router.push(`/collection/${this.collection.name}`)
    } catch (err) {
      this.originalItem = _originalItem // revert
      throw err
    }
  }

  updateItem (v: any) {
    // console.log(`updateSubItem editor ${fieldName}`, v)

    this.item = objectUtil.deepCopy(v)
  }

  updateItemValid (valid: boolean) {
    // console.log(`updateSubItemValid editor ${fieldName}`, valid)

    this.valid = valid
  }
}
</script>

<style lang="scss" scoped>
  .mainEditor {
    // max-width: 600px;
  }
  .short {
    width: 400px;
    max-width: 400px;
  }

  pre.debug {
    margin-top: 0;
  }
</style>
