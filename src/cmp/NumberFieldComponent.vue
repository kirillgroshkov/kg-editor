<template>
  <md-field md-clearable class="short">
    <label :for="field.name">{{ field.label }} ({{field.type}})</label>
    <md-input :name="field.name" :id="field.name"
              :value="value"
              @input="updateValue($event)"
              type="number"
              :required="field.required"
    />
    <span class="md-helper-text" v-if="field.descr">{{ field.descr }}</span>
  </md-field>
</template>

<script lang="ts">
import Component from "vue-class-component";
import { BaseFieldComponent } from './BaseFieldComponent';

@Component
export default class NumberFieldComponent extends BaseFieldComponent {}
</script>
