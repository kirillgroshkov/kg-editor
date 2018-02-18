import { Field } from '@/srv/schema.service'
import { Prop } from 'vue-property-decorator'
import Vue from 'vue'

export class BaseFieldComponent extends Vue {
  @Prop()
  field: Field | undefined

  @Prop()
  item: any
}
