<template>
  <md-checkbox v-model="item[field.name]" class="md-primary short">
    {{ field.label }} &nbsp; <small v-if="field.descr">({{ field.descr }})</small>
  </md-checkbox>
</template>

<script lang="ts">
import Component from "vue-class-component";
import { BaseFieldComponent } from './BaseFieldComponent';

@Component
export default class BooleanFieldComponent extends BaseFieldComponent {}
</script>
