<template>
  <md-field
    :md-clearable="!field.protected"
    :class="validationClass"
    class="short"
  >
    <label :for="field.name">{{ field.label }} ({{field.type}})</label>

    <md-input :name="field.name" :id="field.name"
              :value="value"
              @input="updateValue($event)"
              :required="field.required"
              :maxlength="field.maxLength"
              :disabled="field.protected"
              :class="inputClass"
              v-focus="focus"
              autocomplete="off"
    />

    <span class="md-helper-text" v-if="field.descr">{{ field.descr }}</span>

    <span class="md-error" v-if="!valid">{{validationErrors[0]}}</span>
  </md-field>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { BaseFieldComponent } from './BaseFieldComponent'

@Component
export default class StringFieldComponent extends BaseFieldComponent {
  mounted () {
    super.mounted()
  }
}
</script>

<style lang="scss" scoped>
  .short {
    width: 400px;
    max-width: 400px;
  }

  .md-field {
    margin-bottom: 32px;
  }

  .md-input {
    transition: background-color .3s ease-in-out;

    &.changed {
      background-color: rgba(0, 0, 0, 0.1);
    }
  }
</style>
