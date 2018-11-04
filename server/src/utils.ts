export function getFirst<T>(list: T[], fn: (item: T) => boolean): T | null {
  return list.reduce<T | null>((acc, item) => {
    if (fn(item) && acc === null) {
      return item
    } else {
      return acc
    }
  }, null)
}
