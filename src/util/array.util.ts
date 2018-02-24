class ArrayUtil {
  // mutates
  arrayMove (a: any[], from: number, to: number): void {
    a.splice(to, 0, a.splice(from, 1)[0])
  }
}

export const arrayUtil = new ArrayUtil()
