<template>
  <md-datepicker
    :value="value"
    @input="updateValue($event)"
    md-clearable
    class="short"
  >
    <label>{{ field.label }}</label>
  </md-datepicker>
</template>

<script lang="ts">
import Component from "vue-class-component";
import { BaseFieldComponent } from './BaseFieldComponent';

@Component
export default class DateFieldComponent extends BaseFieldComponent {}
</script>
