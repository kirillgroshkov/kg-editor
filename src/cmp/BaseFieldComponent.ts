import { Field, schemaService } from '@/srv/schema.service'
import { objectUtil } from '@/util/object.util'
import { Prop } from 'vue-property-decorator'
import Vue from 'vue'

export class BaseFieldComponent extends Vue {
  @Prop()
  field: Field | undefined

  @Prop()
  value: any

  @Prop()
  originalValue: any

  @Prop()
  focus: boolean | undefined

  @Prop()
  level: number | undefined

  @Prop()
  forceDirty: boolean | undefined

  dirty = false

  get valueChanged (): boolean {
    return !objectUtil.deepEquals(this.value, this.originalValue)
  }

  get inputClass () {
    return {
      changed: this.valueChanged,
    }
  }

  touch (dirty = true): void {
    this.dirty = dirty
  }

  mounted (): void {
    this.emitValidationState()
  }

  updateValue (v: any) {
    // console.log('updateValue', v)
    this.touch()
    this.$emit('input', v)
    this.emitValidationState()
    // if (this.$v) this.$v['value']!.$touch()
  }

  emitValidationState (): void {
    Vue.nextTick(() => this.$emit('valid', this.valid))
  }

  get validationClass () {
    return {
      'md-invalid': (this.dirty || this.forceDirty) && !this.valid,
    }
  }

  get valid (): boolean {
    return !this.validationErrors.length
  }

  get validationErrors (): string[] {
    return schemaService.validateField(this.field!, this.value)
  }
}
