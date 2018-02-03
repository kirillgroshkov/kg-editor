class StringUtil {
  capitalizeFirstLetter (s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1)
  }
}

export const stringUtil = new StringUtil()
