<template>
  <md-card :md-with-hover="!expanded" class="card">
    <!-- Card header -->
    <md-card-header aclick.native="toggleExpand">
      <md-card-header-text class="md-layout">
        <div style="padding-top: 6px; padding-right: 16px;">
          <div class="md-title" :class="inputClass">{{field.label}} ({{subItems.length}})</div>
          <div class="md-subhead" v-if="field.descr">{{field.descr}}</div>
        </div>

        <div class="md-layout-item" style="padding-top: 2px;">
          <md-button
            class="md-raised md-dense"
            v-focus="focus"
            @click="addEmptySubItem"
            v-show="expandedSubItem === -1"
          >Add</md-button>
        </div>
      </md-card-header-text>

      <md-menu md-size="big" md-direction="bottom-end" v-show="subItems.length && expandedSubItem === -1">
        <md-button class="md-icon-button" @click="toggleExpand" tabindex="-1">
          <md-icon>{{expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}}</md-icon>
        </md-button>
      </md-menu>
    </md-card-header>

    <!-- Card content -->
    <md-card-content v-show="expanded && subItems.length">
      <!-- Expanded item -->
      <md-card v-if="expandedSubItem > -1"
               class="card-subitem"
      >
        <md-card-content class="md-layout">
          <div class="md-layout-item md-size-100 md-layout md-alignment-center-left">
            <component
              v-bind:is="getFieldComponent(field.arrayOf)"
              :field="getSubField()"
              :value="subItems[expandedSubItem]"
              :originalValue="(originalValue || {})[expandedSubItem]"
              :level="level + 1"
              :forceDirty="forceDirty"
              :inArray="true"
              @input="updateSubItem($event, expandedSubItem)"
              @valid="updateSubItemValid($event, expandedSubItem)"
              @save="onSave()"
            />
          </div>
        </md-card-content>
      </md-card>

      <!-- Array of collapsed items -->
      <md-card :md-with-hover="expandedSubItem !== i"
               class="card-subitem"
               v-else
               v-for="(subItem, i) in subItems" :key="subItem ? subItem.id : i"
      >
        <md-card-content class="md-layout" @click.native="expandSubItem(i)">
          <div class="md-layout-item md-size-100 md-layout md-alignment-center-center">
            <div class="md-layout-item" :class="getSubItemClass(i)">
              {{ getCellContent(subItem) }}
            </div>

            <md-button class="md-icon-button" @click.stop="move(i, -1)" :disabled="i === 0"><md-icon>keyboard_arrow_up</md-icon></md-button>
            <md-button class="md-icon-button" @click.stop="move(i, 1)" :disabled="i === subItems.length-1"><md-icon>keyboard_arrow_down</md-icon></md-button>
            <md-button class="md-icon-button" @click.stop="removeSubItem(i)"><md-icon>delete</md-icon></md-button>
          </div>
        </md-card-content>
      </md-card>

      <pre v-if="debug">valid={{valid}} {{subItems}}</pre>
    </md-card-content>
  </md-card>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { schemaService } from '../srv/schema.service';
import { arrayUtil } from '../util/array.util';
import { objectUtil } from '../util/object.util';
import { BaseFieldComponent } from './BaseFieldComponent';

@Component
export default class ArrayFieldComponent extends BaseFieldComponent {
  debug = false
  expanded = true
  expandedSubItem: number = -1
  validationState: {[f: string]: boolean} = {}

  get subItems (): any[] {
    return this.value || []
  }

  set subItems (v: any[]) {
    this.$emit('input', v || [])
    this.emitValidationState()
  }

  get fieldComponent () {
    const subType = this.field!.arrayOf!
    return schemaService.getFieldComponent(subType)
  }

  getSubItemClass (i: number) {
    return {
      changed: !objectUtil.deepEquals(this.subItems[i], (this.originalValue || {})[i]),
    }
  }

  toggleExpand () {
    // alert('toggle')
    this.expanded = !this.expanded
    if (!this.expanded) {
      this.expandedSubItem = -1
    }
  }

  expandSubItem (i: number) {
    if (this.expandedSubItem === i) return

    this.expandedSubItem = i
  }

  move (i: number, dir: number) {
    const subItems = this.subItems
    arrayUtil.arrayMove(subItems, i, i + dir)
    this.subItems = subItems
  }

  addEmptySubItem () {
    const emptyItem = schemaService.getEmptyValueByType(this.field!.arrayOf!) || undefined
    this.subItems = [
      ...this.subItems,
      emptyItem,
    ]

    this.expandedSubItem = this.subItems.length
  }

  removeSubItem (i: number) {
    const subItems = this.subItems
    subItems.splice(i, 1)
    this.subItems = subItems
  }

  getFieldComponent (type: string) {
    return schemaService.getFieldComponent(type)
  }

  getSubField () {
    const subType = this.$store.getters.getTypeByName(this.field!.arrayOf)
    // console.log('subType: ', subType)
    if (subType) {
      // for object types
      subType.type = subType.name
      return subType
    }

    // for primitive types
    return this.field
  }

  getCellContent (subItem: any): string {
    return schemaService.getCellContent(this.getSubField(), subItem) as string
  }

  get valid (): boolean {
    return Object.values(this.validationState).find(v => !v) === undefined
  }

  mounted () {
    this.emitValidationState()
  }

  updateSubItem (v: any, i: any) {
    // console.log('updateSubItem arr [' + i + ']', v)

    if (v !== undefined) {
      const subItems = this.subItems
      subItems[ i ] = v
      this.subItems = subItems
    } else {
      this.removeSubItem(this.expandedSubItem)
      this.expandedSubItem = -1
    }
  }

  updateSubItemValid (valid: boolean, index: number) {
    // console.log(`updateSubItemValid array ${index}`, valid)

    this.validationState = {
      ...this.validationState,
      [index]: valid,
    }
    this.emitValidationState()
  }

  onSave () {
    this.expandedSubItem = -1
    // save!
    this.$emit('save')
  }

  cancelSubItem () {
    this.removeSubItem(this.expandedSubItem)
    this.expandedSubItem = -1
  }
}
</script>

<style lang="scss" scoped>
  .md-title {
    font-size: 14px !important;
    line-height: 26px !important;
    // font-weight: normal !important;
    transition: background-color .3s ease-in-out;
  }

  .changed {
    background-color: rgba(0, 0, 0, 0.1);
  }

  .card {
    width: 100%;
    max-width: 600px;
    box-shadow: none !important;
    margin-left: -16px;
    margin-right: -16px;
    margin-bottom: 12px;
  }

  .card-subitem {
    margin: 0;
    // padding: 0;
    .md-card-content {
      padding: 8px 0 8px 16px;
    }
  }

  .md-card-content {
    padding-bottom: 8px;
  }

  .md-subhead {
    font-size: 12px;
  }

  .md-card-actions {
    padding: 0 !important;
  }
</style>
