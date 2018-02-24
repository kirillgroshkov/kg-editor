class ObjectUtil {
  deepCopy<T> (o: T): T {
    return JSON.parse(JSON.stringify(o))
  }
}

export const objectUtil = new ObjectUtil()
