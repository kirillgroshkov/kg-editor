import ArrayFieldComponent from '@/cmp/ArrayFieldComponent.vue'
import BooleanFieldComponent from '@/cmp/BooleanFieldComponent.vue'
import DateFieldComponent from '@/cmp/DateFieldComponent.vue'
import NumberFieldComponent from '@/cmp/NumberFieldComponent.vue'
import ObjectFieldComponent from '@/cmp/ObjectFieldComponent.vue'
import StringFieldComponent from '@/cmp/StringFieldComponent.vue'
import TextFieldComponent from '@/cmp/TextFieldComponent.vue'
import { stringUtil } from '@/srv/string.util'
import { store } from '@/store'
import { Component } from 'vue'

export interface AppSchema {
  types: SchemaType[]
  collections: Collection[]
}

// ObjectType
export interface SchemaType {
  name: string
  label: string
  labelFields: string[]
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
  descr?: string
  def?: any
  required?: boolean
  protected?: boolean
  labelField?: boolean

  minLength?: number
  maxLength?: number
  regex?: string
  regexDescr?: string

  objectOf?: string
  arrayOf?: string
}

const TYPE_MAP: { [type: string]: any } = {
  boolean: BooleanFieldComponent,
  string: StringFieldComponent,
  date: DateFieldComponent,
  text: TextFieldComponent,
  number: NumberFieldComponent,
  object: ObjectFieldComponent,
  array: ArrayFieldComponent,
}

const EMPTY_ITEM_MAP: { [type: string]: () => any } = {
  boolean: () => false,
  id: () => '',
  string: () => '',
  text: () => '',
  array: () => [],
  number: () => undefined,
  // date: DateFieldComponent,
  // object: ObjectFieldComponent,
}

const DEF_FIELD_COMP = StringFieldComponent

class SchemaService {
  isObjectType (type: string): boolean {
    return !!store.getters.getTypeByName(type)
  }

  getFieldComponent (type: string): Component {
    const c = TYPE_MAP[type]
    if (c) return c

    if (this.isObjectType(type)) return ObjectFieldComponent

    return DEF_FIELD_COMP
  }

  getEmptyValueByType (type: string): any {
    const t: SchemaType = store.getters.getTypeByName(type)
    if (t) {
      // object type
      const o: any = {}
      t.fields.forEach(f => {
        if (f.def !== undefined) {
          // todo: validate (e.g number, or boolean)
          o[f.name] = f.def
        } else {
          o[f.name] = this.getEmptyValueByType(f.type)
        }
      })
      return o
    }

    return EMPTY_ITEM_MAP[type] ? EMPTY_ITEM_MAP[type]() : undefined
  }

  // array of array is not allowed ATM
  getCellContent (f: Field, value: any): string | string[] | undefined {
    if (value === undefined) return undefined
    const typeName = f.type

    if (typeName === 'array') {
      return value.map((i: any) => this.getCellContentByType(f.arrayOf!, i, 2))
    }

    return this.getCellContentByType(typeName, value, 1)
  }

  private getCellContentByType (typeName: string, value: any, level: number): string | undefined {
    if (value === undefined) return undefined

    const t: SchemaType = store.getters.getTypeByName(typeName)
    if (!t) {
      // primitive type
      return value
    }

    // object type
    const labelItems: string[] = []
    t.labelFields.forEach(fieldName => {
      const field = t.fields.find(f => f.name === fieldName)
      if (field) {
        const labelItem = this.getCellContentByType(field.type, value[fieldName], level + 1)
        if (labelItem !== undefined) labelItems.push(labelItem)
      }
    })
    return labelItems.join(', ')
  }

  validateField (f: Field, o: any): string[] {
    const e: string[] = []

    if (f.required) {
      // todo: support array and object types
      if (!o) e.push(`required`)
    }

    if (f.minLength) {
      if (o && o.length < f.minLength) e.push(`should be longer than ${f.minLength}`)
    }

    if (f.maxLength) {
      if (o && o.length > f.maxLength) e.push(`should be shorter than ${f.minLength}`)
    }

    if (f.regex) {
      const regex = new RegExp(f.regex)
      if (o && !regex.test(o)) e.push(f.regexDescr || `should match regex: ${f.regex}`)
    }

    return e
  }

  // mutates
  completeSchema (s: AppSchema): void {
    s.types.forEach(t => this.completeType(t))
    s.collections.forEach(c => this.completeCollection(c))
  }

  // mutates
  private completeType (t: SchemaType): void {
    Object.assign(t, {
      label: t.label || stringUtil.capitalizeFirstLetter(t.name),
    })

    const labelFields: string[] = []
    t.fields.forEach(f => {
      this.completeField(f)
      if (f.labelField) labelFields.push(f.name)
    })

    t.labelFields = labelFields.length ? labelFields : ['id']
  }

  // mutates
  private completeField (f: Field): void {
    if (f.name === 'id') {
      Object.assign(f, {
        type: 'id',
        label: 'id',
        required: true,
        regex: '^[a-zA-Z0-9-_]{1,32}$',
        regexDescr: 'Should be alphanumeric (dashes and underscores allowed)',
        maxLength: f.maxLength || 32,
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
}

export const schemaService = new SchemaService()
