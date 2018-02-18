<template>
  <md-field md-clearable>
    <label :for="field.name">{{ field.label }} ({{field.type}})</label>
    <md-textarea :name="field.name" :id="field.name"
                 v-model="item[field.name]"
                 :maxlength="field.maxLength"
                 :required="field.required"
                 md-autogrow1
    />
    <span class="md-helper-text" v-if="field.descr">{{ field.descr }}</span>
  </md-field>
</template>

<script lang="ts">
import Component from "vue-class-component";
import { BaseFieldComponent } from './BaseFieldComponent';

@Component
export default class TextFieldComponent extends BaseFieldComponent {}
</script>
