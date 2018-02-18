import StringFieldComponent from '@/cmp/StringFieldComponent.vue'
import BooleanFieldComponent from '@/cmp/BooleanFieldComponent.vue'
import DateFieldComponent from '@/cmp/DateFieldComponent.vue'
import TextFieldComponent from '@/cmp/TextFieldComponent.vue'
import NumberFieldComponent from '@/cmp/NumberFieldComponent.vue'
import ObjectFieldComponent from '@/cmp/ObjectFieldComponent.vue'
import ArrayFieldComponent from '@/cmp/ArrayFieldComponent.vue'
import { stringUtil } from '@/srv/string.util'
import { store } from '@/store'
import { Component } from 'vue'

export interface AppSchema {
  types: SchemaType[]
  collections: Collection[]
}

export interface SchemaType {
  name: string
  label: string
  fields: Field[]
}

export interface Collection {
  name: string
  label: string
  icon: string
  folders: boolean
  type: string
}

export interface Field {
  name: string
  label: string
  type: string
  required: boolean

  minLength?: number
  maxLength?: number

  objectOf?: string
  arrayOf?: string
}

const TYPE_MAP: {[type: string]: any} = {
  boolean: BooleanFieldComponent,
  string: StringFieldComponent,
  date: DateFieldComponent,
  text: TextFieldComponent,
  number: NumberFieldComponent,
  object: ObjectFieldComponent,
  array: ArrayFieldComponent,
}

const DEF_FIELD_COMP = StringFieldComponent


class SchemaService {
  getFieldComponent (type: string): Component {
    let c = TYPE_MAP[type]
    if (c) return c

    c = store.getters.getTypeByName(type)
    if (c) return ObjectFieldComponent

    return DEF_FIELD_COMP
  }

  // mutates
  completeSchema (s: AppSchema): void {
    s.types.forEach(t => this.completeType(t))
    s.collections.forEach(c => this.completeCollection(c))
  }

  // mutates
  private completeField (f: Field): void {
    if (f.name === 'id') {
      Object.assign(f, {
        type: 'id',
        label: 'id',
        maxLength: f.maxLength || 16,
      })
    }

    Object.assign(f, {
      type: f.type || 'string',
      label: f.label || stringUtil.capitalizeFirstLetter(f.name),
    })
  }

  // mutates
  private completeCollection (c: Collection): void {
    Object.assign(c, {
      label: c.label || stringUtil.capitalizeFirstLetter(c.name),
      icon: c.icon || 'collections',
    })
  }

  // mutates
  private completeType (t: SchemaType): void {
    Object.assign(t, {
      label: t.label || stringUtil.capitalizeFirstLetter(t.name),
    })

    t.fields.forEach(f => this.completeField(f))
  }
}

export const schemaService = new SchemaService()
