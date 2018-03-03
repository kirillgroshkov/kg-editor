<template>
  <md-field
    :md-clearable="!field.protected"
    class="short"
  >
    <label :for="field.name">{{ field.label }} ({{field.type}})</label>
    <md-input :name="field.name" :id="field.name"
              :value="value"
              @input="updateValue($event)"
              :required="field.required"
              :maxlength="field.maxLength"
              :disabled="field.protected"
              v-focus="focus"
    />
    <span class="md-helper-text" v-if="field.descr">{{ field.descr }}</span>
  </md-field>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { BaseFieldComponent } from './BaseFieldComponent';

@Component
export default class StringFieldComponent extends BaseFieldComponent {

}
</script>

<style lang="scss" scoped></style>
