import StringFieldComponent from '@/cmp/StringFieldComponent.vue'
import BooleanFieldComponent from '@/cmp/BooleanFieldComponent.vue'
import DateFieldComponent from '@/cmp/DateFieldComponent.vue'
import TextFieldComponent from '@/cmp/TextFieldComponent.vue'
import NumberFieldComponent from '@/cmp/NumberFieldComponent.vue'

export interface AppSchema {
  collections: Collection[]
}

export interface Collection {
  name: string
  label: string
  icon: string
  folders: boolean
  fields: Field[]
}

export interface Field {
  name: string
  label: string
  type: string
  required: boolean

  minLength?: number
  maxLength?: number
}

const TYPE_MAP: {[type: string]: any} = {
  boolean: BooleanFieldComponent,
  string: StringFieldComponent,
  date: DateFieldComponent,
  text: TextFieldComponent,
  number: NumberFieldComponent,
}

const DEF_FIELD_COMP = StringFieldComponent


class SchemaService {
  getFieldComponent (f: Field) {
    return TYPE_MAP[f.type] || DEF_FIELD_COMP
  }
}

export const schemaService = new SchemaService()
