<template>
  <md-card :md-with-hover="!expanded" class="card" :class="{deep: level > 1, root: isRootLevel}">
    <md-card-header v-if="level > 0">
      <md-card-header-text class="md-layout">
        <div style="padding-top: 6px; padding-right: 16px;">
          <div class="md-title" :class="inputClass">{{field.label}}</div>
          <div class="md-subhead" v-if="field.descr">{{field.descr}}</div>
        </div>

        <div class="md-layout-item" style="padding-top: 2px;" v-if="level > 1">
          <md-button
            class="md-raised md-dense"
            @click="onSave()"
            v-if="saveEnabled"
          >Save</md-button>

          <md-button
            class="md-raised md-dense"
            av-focus="focus"
            @click="onClose()"
            v-if="closeEnabled"
          >Close</md-button>

          <md-button
            class="md-raised md-dense"
            av-focus="focus"
            @click="onReset"
            :disabled="!resetEnabled"
            aif="saveEnabled"
          >Reset</md-button>
        </div>
      </md-card-header-text>

      <md-menu md-size="big" md-direction="bottom-end">
        <md-button class="md-icon-button" @click="toggleExpand" v-if="!saveEnabled">
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
        :originalValue="(originalValue || {})[f.name]"
        :forceDirty="forceDirty || localForceDirty"
        :level="level + 1"
        :focus="f.name === focusedFieldName"
        @input="updateSubItem($event, f.name)"
        @valid="updateSubItemValid($event, f.name)"
        @save="onSave()"
        />

      <pre v-if="debug">valid={{valid}} expanded={{expanded}}
{{subItem}}
original {{originalValue}}</pre>
    </md-card-content>
  </md-card>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Field, schemaService, SchemaType } from "../srv/schema.service"
import { BaseFieldComponent } from './BaseFieldComponent';

@Component
export default class ObjectFieldComponent extends BaseFieldComponent {
  expanded = true
  debug = false
  validationState: {[f: string]: boolean} = {}
  localForceDirty = false

  get subType (): SchemaType {
    // console.log('subType: ' + this.field!.type)
    return this.$store.getters.getTypeByName(this.field!.type)
  }

  get subItem (): any {
    return this.value
  }

  set subItem (v: any) {
    this.$emit('input', v)
    this.emitValidationState()
  }

  getFieldComponent (type: string) {
    return schemaService.getFieldComponent(type)
  }

  get valid (): boolean {
    return Object.keys(this.validationState)
      .map(k => this.validationState[k])
      .find(v => !v) === undefined
  }

  get saveEnabled (): boolean {
    return !this.$store.state.ghostMode && this.valueChanged && (this.valid || !this.forceDirty || !this.localForceDirty)
  }

  get resetEnabled (): boolean {
    return this.valueChanged
  }

  get closeEnabled (): boolean {
    return !this.valueChanged
  }

  get isRootLevel (): boolean {
    return this.level === 0
  }

  get focusedFieldName (): string | undefined {
    const f = this.subType.fields.find(f => !f.protected)
    return f ? f.name : undefined
  }

  mounted () {
    this.emitValidationState()
  }

  toggleExpand () {
    if (this.inArray) {
      this.onSave()
    } else {
      this.expanded = !this.expanded
    }
  }

  updateSubItem (v: any, fieldName: string) {
    // console.log('updateSubItem obj ' + fieldName, v)

    this.subItem = {
      ...this.subItem,
      [fieldName]: v,
    }
  }

  updateSubItemValid (valid: boolean, fieldName: string) {
    // console.log(`updateSubItemValid obj ${fieldName}`, valid)

    this.validationState = {
      ...this.validationState,
      [fieldName]: valid,
    }
    this.emitValidationState()
  }

  onSave () {
    // Validate before saving
    if (!this.valid) {
      this.localForceDirty = true
      return
    }

    this.$emit('save')
  }

  onClose () {
    this.$emit('close')
  }

  onReset () {
    this.$emit('input', this.originalValue)
    // this.$emit('objectCancelled')
  }
}
</script>

<style lang="scss" scoped>
  .card {
    width: 100%;
    max-width: 600px;
    margin-bottom: 10px;
    margin-left: 0;
    margin-right: 0;

    &.deep {
      box-shadow: none !important;
      margin-left: -16px;
      margin-right: -16px;
      margin-bottom: 0;
    }

    &.root {
      max-width: none;
      width: auto;
      box-shadow: none !important;
      margin-left: -16px;
      margin-right: -16px;
      margin-bottom: 0;
    }
  }

  .md-title {
    font-size: 14px !important;
    line-height: 26px !important;
    // font-weight: normal !important;
    transition: background-color .3s ease-in-out;

    &.changed {
      background-color: rgba(0, 0, 0, 0.1);
    }
  }

  .md-subhead {
    font-size: 12px;
  }

  .md-card-content {
    padding-bottom: 8px;
  }
</style>
