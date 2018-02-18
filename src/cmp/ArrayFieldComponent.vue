<template>
  <md-card style="width: 100%; max-width: 600px; margin-bottom: 20px;">
    <md-card-header>
      <md-card-header-text>
        <div class="md-title">{{field.name}} ({{subItems.length}})</div>
        <!--<div class="md-subhead">{{field.type}}</div>-->
      </md-card-header-text>

      <md-menu md-size="big" md-direction="bottom-end">
        <md-button class="md-icon-button" md-menu-trigger>
          <md-icon>more_vert</md-icon>
        </md-button>

        <md-menu-content>
          <md-menu-item>
            <span>Call</span>
            <md-icon>phone</md-icon>
          </md-menu-item>

          <md-menu-item>
            <span>Send a message</span>
            <md-icon>message</md-icon>
          </md-menu-item>
        </md-menu-content>
      </md-menu>
    </md-card-header>

    <md-card-content>
      <div v-for="subItem in subItems" :key="subItem.id" class1="md-layout-item">
        {{subItem}} (edit) (delete) (up) (down)
      </div>
      <!--
      <component
        v-for="subItem in subItems" :key="subItem.id"
        v-bind:is="fieldComponent"
        :field="field" :item="subItem"/>-->
    </md-card-content>

    <md-card-actions md-alignment="left">
      <md-button>Add</md-button>
    </md-card-actions>
  </md-card>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { schemaService } from '../srv/schema.service';
import { BaseFieldComponent } from './BaseFieldComponent';

@Component
export default class ArrayFieldComponent extends BaseFieldComponent {
  get subItems (): any[] {
    const a = this.item[this.field!.name]
    if (!a) return []
    const subItems = JSON.parse(a)
    return subItems
  }

  get fieldComponent () {
    const subType = this.field!.arrayOf!
    return schemaService.getFieldComponent(subType)
  }
}
</script>

<style lang="scss" scoped></style>
