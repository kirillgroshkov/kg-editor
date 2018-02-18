<template>
  <md-card style="width: 100%; max-width: 600px; margin-bottom: 20px;">
    <md-card-header>
      <md-card-header-text>
        <div class="md-title">{{field.name}}</div>
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
      <component
        v-for="f in subType.fields" :key="f.name"
        v-bind:is="getFieldComponent(f.type)"
        :field="f" :item="subItem"/>
    </md-card-content>
  </md-card>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Field, schemaService } from "../srv/schema.service"
import { BaseFieldComponent } from './BaseFieldComponent';

@Component
export default class ObjectFieldComponent extends BaseFieldComponent {
  get subType (): Field {
    return this.$store.getters.getTypeByName(this.field!.type)
  }

  get subItem (): any {
    const o = this.item[this.field!.name]
    if (!o) return {}
    const subItem = JSON.parse(o)
    return subItem
  }

  getFieldComponent (type: string) {
    return schemaService.getFieldComponent(type)
  }
}
</script>

<style lang="scss" scoped></style>
