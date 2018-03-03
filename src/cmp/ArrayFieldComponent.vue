<template>
  <md-card :md-with-hover="!expanded"
           style="width: 100%; max-width: 600px; margin-bottom: 20px; margin-left: 0; margin-right: 0;">
    <md-card-header @click.native="toggleExpand">
      <md-card-header-text>
        <div class="md-title" @click.native="toggleExpand">{{field.label}} ({{subItems.length}})</div>
        <div class="md-subhead" v-if="field.descr">{{field.descr}}</div>
      </md-card-header-text>

      <md-menu md-size="big" md-direction="bottom-end" @click="toggleExpand">
        <md-button class="md-icon-button" @click="toggleExpand" tabindex="-1">
          <md-icon>{{expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}}</md-icon>
        </md-button>
      </md-menu>
    </md-card-header>

    <md-card-content v-show="expanded">
      <md-card :md-with-hover="expandedSubItem !== i"
               class="card-subitem"
               v-for="(subItem, i) in subItems" :key="subItem ? subItem.id : i"
      >
        <md-card-content class="md-layout" @click.native="expandSubItem(i)">
          <div class="md-layout-item md-size-100 md-layout md-alignment-center-center" v-if="expandedSubItem !== i">
            <div class="md-layout-item">
              {{subItem || 'empty'}}
            </div>
            <md-button class="md-icon-button" @click.stop="move(i, -1)" :disabled="i === 0"><md-icon>keyboard_arrow_up</md-icon></md-button>
            <md-button class="md-icon-button" @click.stop="move(i, 1)" :disabled="i === subItems.length-1"><md-icon>keyboard_arrow_down</md-icon></md-button>
            <md-button class="md-icon-button" @click.stop="removeSubItem(i)"><md-icon>delete</md-icon></md-button>
          </div>

          <div class="md-layout-item md-size-100 md-layout md-alignment-center-left" v-if="expandedSubItem === i">
            <component
              v-bind:is="getFieldComponent(field.arrayOf)"
              :field="getSubField()"
              :value="subItems[i]"
              @input="updateSubItem($event, i)"
            />
          </div>
        </md-card-content>

        <md-card-actions md-alignment="left" v-if="expandedSubItem === i">
          <md-button @click="onDone">Done</md-button>
        </md-card-actions>
      </md-card>

      <pre v-if="debug">{{subItems}}</pre>
    </md-card-content>

    <md-card-actions md-alignment="left" v-show="expanded">
      <md-button @click="addEmptySubItem" v-focus="focus">Add</md-button>
    </md-card-actions>
  </md-card>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { schemaService } from '../srv/schema.service';
import { arrayUtil } from '../util/array.util';
import { BaseFieldComponent } from './BaseFieldComponent';

@Component
export default class ArrayFieldComponent extends BaseFieldComponent {
  debug = false
  expanded = true
  expandedSubItem: number = -1

  get subItems (): any[] {
    // console.log('subItemssss', this.value)
    return this.value || []
    /*
    // const a = this.item[this.field!.name]
    const a = this.value
    if (!a) return []
    const subItems = JSON.parse(a)
    return subItems*/
  }

  set subItems (v: any[]) {
    // this.$emit('input', JSON.stringify(v || []))
    this.$emit('input', v || [])
  }

  get fieldComponent () {
    const subType = this.field!.arrayOf!
    return schemaService.getFieldComponent(subType)
  }

  toggleExpand () {
    this.expanded = !this.expanded
    if (!this.expanded) {
      this.expandedSubItem = -1
    }
  }

  expandSubItem (i: number) {
    if (this.expandedSubItem === i) return

    this.expandedSubItem = i
  }

  onDone () {
    this.expandedSubItem = -1
  }

  move (i: number, dir: number) {
    const subItems = this.subItems
    arrayUtil.arrayMove(subItems, i, i + dir)
    this.subItems = subItems
  }

  addEmptySubItem () {
    const emptyItem = schemaService.isObjectType(this.field!.arrayOf!) ? {} : undefined
    const subItems = this.subItems
    subItems.push(emptyItem)
    this.subItems = subItems
    this.expandedSubItem = subItems.length - 1
    // console.log('exp: ' + this.expandedSubItem)
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

  updateSubItem (v: any, i: any) {
    // console.log('updateSubItem arr [' + i + ']', v)

    const subItems = this.subItems
    subItems[i] = v
    this.subItems = subItems
  }
}
</script>

<style lang="scss" scoped>
  .card-subitem {
    margin: 0;
    // padding: 0;
    .md-card-content {
      padding: 8px 0 8px 16px;
    }
  }
</style>
