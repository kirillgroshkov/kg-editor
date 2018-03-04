<template>
  <pre v-if="loading">{{loading}}</pre>
  <div v-else>
    <md-button class="md-raised md-primary"
               style="margin-left: 0;"
               :disabled="!saveEnabled"
               @click="onSave(true)"
    >Save (⌘+S)</md-button>

    <md-button class="md-raised md-transparent"
               :disabled="!exitEnabled"
               @click="onExit"
    >Exit (⌘←)</md-button>

    <form novalidate class="md-layout">
      <component
        v-for="(f, i) in fields" :key="f.name"
        v-bind:is="getFieldComponent(f.type)"
        :value="item[f.name]"
        :originalValue="originalItem[f.name]"
        :forceDirty="forceDirty"
        @input="updateSubItem($event, f.name)"
        @valid="updateSubItemValid($event, f.name)"
        :field="f"
        :focus="i === focusedIndex"
        :level="1"
      />
    </form>

    <pre v-if="debug">item: {{ item }}</pre>
    <pre v-if="debug">validationState ({{valid}}): {{ validationState }}</pre>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Progress } from '../decorators/progress.decorator';
import { router } from '../router';
import { apiService } from "../srv/api.service"
import { dialogService } from '../srv/dialog.service';
import { Collection, Field, schemaService } from "../srv/schema.service"
import { mousetrapUtil } from '../util/mousetrap.util';
import { objectUtil } from '../util/object.util';

@Component
export default class EditorPage extends Vue {
  loading = 'loading...'
  validationState: {[f: string]: boolean} = {}
  forceDirty = false
  debug = false

  get collection (): Collection {
    return this.$store.getters.getCollectionByName(this.$route.params['collectionName'])
  }

  get fields (): Field[] {
    const type = this.collection.type
    return this.$store.getters.getTypeByName(type).fields
  }

  get itemId (): string {
    return this.$route.params['itemId']
  }

  get newItem (): boolean {
    return this.itemId === 'new'
  }

  get focusedIndex (): number {
    return this.fields.findIndex(f => !f.protected)
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

  get valid (): boolean {
    return Object.keys(this.validationState)
      .map(k => this.validationState[k])
      .find(v => !v) === undefined
  }

  item: any = null

  // this is what is saved to db
  originalItem: any = null

  getFieldComponent (type: string) {
    return schemaService.getFieldComponent(type)
  }

  @Progress()
  async mounted () {
    this.loading = 'loading...'

    // console.log('mounted! ' + this.itemId)
    if (this.newItem) {
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

  updateSubItem (v: any, fieldName: string) {
    // console.log(`updateSubItem editor ${fieldName}`, v)

    // Vue.set(this.item, fieldName, v)
    this.item = {
      ...this.item,
      [fieldName]: objectUtil.deepCopy(v),
    }
  }

  updateSubItemValid (valid: boolean, fieldName: string) {
    // console.log(`updateSubItemValid editor ${fieldName}`, valid)

    // Vue.nextTick(() => this.validationState[fieldName] = valid)
    this.validationState = {
      ...this.validationState,
      [fieldName]: valid,
    }

    // Vue.set(this.item, fieldName, v)
    /*this.item = {
      ...this.item,
      [fieldName]: objectUtil.deepCopy(v),
    }*/
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
