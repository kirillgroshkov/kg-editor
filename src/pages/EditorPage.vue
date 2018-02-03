<template>
  <div v-if="item">
    <md-button class="md-raised md-primary"><md-icon>save</md-icon> Save</md-button>
    <md-button class="md-raised md-transparent" @click="onCancel"><md-icon>cancel</md-icon> Cancel</md-button>

    <form novalidate class="md-layout" @submit.prevent="onSubmit">
      <template v-for="f in collection.fields">
        <!-- Boolean -->
        <template v-if="f.type === 'boolean'">
          <md-checkbox v-model="item[f.name]" class="md-primary short">
            {{ f.label }} &nbsp; <small v-if="f.descr">({{ f.descr }})</small>
          </md-checkbox>
        </template>

        <!-- Date -->
        <template v-else-if="f.type === 'date'">
          <md-datepicker v-model="item[f.name]" md-clearable class="short">
            <label>{{ f.label }}</label>
          </md-datepicker>
        </template>

        <!-- Text -->
        <template v-else-if="f.type === 'markdown'">
          <md-field md-clearable>
            <label :for="f.name">{{ f.label }} ({{f.type}})</label>
            <md-textarea :name="f.name" :id="f.name"
                         v-model="item[f.name]"
                         :maxlength="f.maxLength"
                         :required="f.required"
                         md-autogrow1
            />
            <span class="md-helper-text" v-if="f.descr">{{ f.descr }}</span>
          </md-field>
        </template>

        <!-- Number -->
        <template v-else-if="f.type === 'number'">
          <md-field md-clearable class="short">
            <label :for="f.name">{{ f.label }} ({{f.type}})</label>
            <md-input :name="f.name" :id="f.name"
                      v-model="item[f.name]"
                      type="number"
                      :required="f.required"
            />
            <span class="md-helper-text" v-if="f.descr">{{ f.descr }}</span>
          </md-field>
        </template>

        <!-- otherwise: String type -->
        <template v-else>
          <md-field md-clearable class="short">
            <label :for="f.name">{{ f.label }} ({{f.type}})</label>
            <md-input :name="f.name" :id="f.name"
                      v-model="item[f.name]"
                      :required="f.required"
                      :maxlength="f.maxLength"
            />
            <span class="md-helper-text" v-if="f.descr">{{ f.descr }}</span>
          </md-field>
        </template>
      </template>
    </form>
    {{ item }} {{typeof item.date1}}
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { router } from '../router';
import { apiService, Collection } from "../srv/api.service"

@Component
export default class EditorPage extends Vue {
  get collection (): Collection {
    return this.$store.getters.getCollectionByName(this.$route.params['collectionName'])
  }

  get itemId (): string {
    return this.$route.params['itemId']
  }

  get newItem (): boolean {
    return this.itemId === 'new'
  }

  item: any = null

  async mounted () {
    // console.log('mounted! ' + this.itemId)
    if (this.newItem) {
      this.item = {} // tada: put default values for each field
    } else {
      this.item = this.$store.getters.getItem(this.collection.name, this.itemId)
      if (!this.item) {
        await apiService.getItems(this.collection.name)
        this.item = this.$store.getters.getItem(this.collection.name, this.itemId)
        if (!this.item) alert('item not found!')
      }
    }
  }

  onCancel () {
    router.push(`/collection/${this.collection.name}`)
  }

  onSubmit () {
    alert('onSubmit')
  }
}
</script>

<style lang="scss" scoped>
  form {
    max-width: 790px;
  }
  .short {
    width: 400px;
    max-width: 400px;
  }
</style>
