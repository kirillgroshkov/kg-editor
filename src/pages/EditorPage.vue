<template>
  <pre v-if="loading">{{loading}}</pre>
  <div v-else class="md-layout-item">
    <div class="md-layout-item md-layout buttons" style="margin-left: -8px;">
      <template v-if="!jsonMode">
        <md-button class="md-raised md-primary"
                   :disabled="!saveEnabled"
                   @click="onSave(true)"
        >{{ saveButtonLabel }}</md-button>

        <md-button class="md-raised md-transparent"
                   :disabled="!resetEnabled"
                   @click="onReset"
        >Reset</md-button>

        <md-button class="md-raised md-transparent"
                   :disabled="!exitEnabled"
                   @click="onExit"
        >Exit (⌘←)</md-button>

        <md-button class="md-raised md-transparent"
                   v-if="false"
                   @click="onExport()"
        >Export</md-button>
      </template>

      <md-button class="md-raised md-transparent"
                 :disabled="!modeEnabled"
                 @click="onMode()"
      >{{ modeLabel }}</md-button>

      <md-button class="md-raised md-transparent copyToClipboard"
                 v-if="jsonMode"
                 :disabled="!modeEnabled"
      >copy to clipboard</md-button>
    </div>

    <div class="mainEditor">
      <!-- JSON mode-->
      <template v-if="jsonMode">
        <div id="jsonEditor"></div>
        <pre>{{ item }}</pre>
      </template>

      <!-- UI mode-->
      <template v-if="!jsonMode">
        <component
          v-bind:is="getFieldComponent(collection.type)"
          :value="item"
          :originalValue="originalItem"
          :forceDirty="forceDirty"
          :field="field"
          :level="0"
          @input="updateItem"
          @valid="updateItemValid"
          @save="onSave()"
        />

        <pre v-if="debug" class="debug">item (valid={{valid}}): {{ item }}</pre>
      </template>
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
import { mousetrapUtil } from '../util/mousetrap.util'
import { objectUtil } from '../util/object.util'
import * as Clipboard from 'clipboard'
import { Editor } from 'brace'
import * as ace from 'brace'
import 'brace/mode/json'
import 'brace/theme/dracula'

@Component
export default class EditorPage extends Vue {
  loading = 'loading...'
  valid = false
  forceDirty = false
  debug = true
  jsonMode = false
  jsonEditor: Editor = false as any
  jsonValid = false
  clip: Clipboard = false as any

  item: any = false as any

  // this is what is saved to db
  originalItem: any = false as any

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
    return !this.$store.state.ghostMode && (this.valid || !this.forceDirty)
  }

  get resetEnabled (): boolean {
    return !this.$store.state.ghostMode && this.valueChanged
  }

  get exitEnabled (): boolean {
    return !this.$store.state.ghostMode && this.isNewItem
  }

  get modeEnabled (): boolean {
    return !this.jsonMode || this.jsonValid
  }

  get saveButtonLabel (): string {
    return (this.valueChanged || this.isNewItem) ? 'Save (⌘+S)' : 'Close (⌘←)'
  }

  get modeLabel () {
    return this.jsonMode ? 'UI mode' : 'JSON mode'
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
      // 'command+x': () => this.onExit(),
      'command+left': () => this.onSave(true),
      'esc': () => this.onSave(true),
    })
  }

  destroyed () {
    mousetrapUtil.unbind(['command+s', 'command+x', 'command+left', 'esc'])
  }

  async onReset () {
    if (!this.resetEnabled) return

    const confirm = await dialogService.dialog({
      title: 'Reset',
      content: 'Please confirm that you want to reset to original value',
      textOk: 'Reset',
      textCancel: 'Cancel',
    })
    if (!confirm) return

    this.doReset()
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

    this.doExit()
  }

  doExit () {
    router.push(`/collection/${this.collection.name}`)
  }

  doReset () {
    this.item = objectUtil.deepCopy(this.originalItem)
  }

  async onSave (exit = false) {
    if (!this.valueChanged && !this.isNewItem) return this.doExit()

    if (!this.saveEnabled) return

    // Validate before saving
    if (!this.valid) {
      this.forceDirty = true
      return
    }

    await this.doSave()
    this.forceDirty = false
    if (exit) {
      this.doExit()
    } else {
      if (this.isNewItem) {
        router.push(`/edit/${this.collection.name}/${this.item.id}`)
      }
    }
  }

  async onExport () {
    const jsonStr = JSON.stringify(this.item, undefined, 2)

    const dialogPromise = dialogService.dialog({
      title: 'Export',
      content: `<button id="copy1" style="width: 100%; height: 30px;">Copy to clipboard</button><pre>${jsonStr}</pre>`,
    })
    const clip = new Clipboard('#copy1', {
      text: () => jsonStr,
    })

    await dialogPromise
    clip.destroy()
  }

  onMode () {
    this.jsonMode = !this.jsonMode

    if (this.jsonMode) {
      // entering jsonMode
      Vue.nextTick(() => {
        this.jsonValid = true
        this.jsonEditor = ace.edit('jsonEditor')
        this.jsonEditor.$blockScrolling = Infinity
        this.jsonEditor.getSession().setMode('ace/mode/json')
        this.jsonEditor.setTheme('ace/theme/dracula')
        this.jsonEditor.setValue(JSON.stringify(this.item, undefined, 2))
        this.jsonEditor.session.on('change', () => {
          try {
            this.item = JSON.parse(this.jsonEditor!.getValue())
            this.jsonValid = true
          } catch (err) {
            this.jsonValid = false
          }
        })

        this.clip = new Clipboard('.copyToClipboard', {
          text: () => JSON.stringify(this.item, undefined, 2),
        })
      })
    } else {
      // exiting jsonMode
      this.jsonEditor!.destroy()
      this.clip!.destroy()
      // this.jsonEditor = null
      this.forceDirty = true
    }
  }

  @Progress()
  async doSave () {
    console.log('saving', JSON.stringify(this.item, undefined, 2))
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

  #jsonEditor {
    // background-color: red;
    width: 100%;
    height: 400px;
    // min-height: 100%;
    // height: 100%;
  }
</style>
