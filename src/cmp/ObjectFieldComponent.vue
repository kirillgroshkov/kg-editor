<template>
  <md-card :md-with-hover="!expanded"
           style="width: 100%; max-width: 600px; margin-bottom: 20px; margin-left: 0; margin-right: 0;">
    <md-card-header @click.native="toggleExpand">
      <md-card-header-text>
        <div class="md-title" @click.native="toggleExpand">{{field.label}}</div>
        <div class="md-subhead" v-if="field.descr">{{field.descr}}</div>
      </md-card-header-text>

      <md-menu md-size="big" md-direction="bottom-end" @click="toggleExpand">
        <md-button class="md-icon-button" @click="toggleExpand">
          <md-icon>{{expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}}</md-icon>
        </md-button>
      </md-menu>
    </md-card-header>

    <md-card-content v-show="expanded">
      <component
        v-for="f in subType.fields" :key="f.name"
        v-bind:is="getFieldComponent(f.type)"
        :field="f"
        :value="subItem[f.name]"
        @input="updateSubItem($event, f.name)"
        />

      <pre>{{subItem}}</pre>
    </md-card-content>
  </md-card>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Field, schemaService } from "../srv/schema.service"
import { BaseFieldComponent } from './BaseFieldComponent';

@Component
export default class ObjectFieldComponent extends BaseFieldComponent {
  expanded = true

  get subType (): Field {
    console.log('subType: ' + this.field!.type)
    return this.$store.getters.getTypeByName(this.field!.type)
  }

  get subItem (): any {
    return JSON.parse(this.value || '{}')
  }

  set subItem (v: any) {
    this.$emit('input', JSON.stringify(v || {}))
  }

  getFieldComponent (type: string) {
    return schemaService.getFieldComponent(type)
  }

  toggleExpand () {
    this.expanded = !this.expanded
  }

  updateSubItem (v: any, fieldName: string) {
    console.log('updateSubItem', v, fieldName)

    this.subItem = {
      ...this.subItem,
      [fieldName]: v,
    }
  }
}
</script>

<style lang="scss" scoped></style>
