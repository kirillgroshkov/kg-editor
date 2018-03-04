<template>
  <div>
    <md-dialog-confirm
      :md-active.sync="dialogActive"
      :md-title="dialog.title"
      :md-content="dialog.content"
      :md-confirm-text="dialog.textOk"
      :md-cancel-text="dialog.textCancel"
      @md-cancel="dialogResolve(false)"
      @md-confirm="dialogResolve(true)" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Dialog, dialogService } from "../srv/dialog.service"

@Component
export default class DialogComponent extends Vue {
  // dialogActive = false
  get dialogActive (): boolean {
    return !!this.$store.state.dialog
  }
  set dialogActive (_) {}

  get dialog (): Dialog {
    return this.$store.state.dialog || {}
  }

  dialogResolve (r: boolean) {
    dialogService.dialogResolve(r)
  }
}
</script>

<style lang="scss" scoped></style>
