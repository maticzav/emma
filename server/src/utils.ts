import fetch from 'isomorphic-fetch'

/**
 *
 * Returns the first item that mathces the predicate.
 *
 * @param list
 * @param fn
 */
export function getFirst<T>(list: T[], fn: (item: T) => boolean): T | null {
  return list.reduce<T | null>((acc, item) => {
    if (fn(item) && acc === null) {
      return item
    } else {
      return acc
    }
  }, null)
}

/**
 *
 * Removes duplicates from array.
 *
 * @param list
 */
export function dedupe<T>(list: T[]): T[] {
  return list.reduce<T[]>((acc, el) => {
    if (acc.includes(el)) return acc
    else return acc.concat(el)
  }, [])
}

/**
 *
 * Downloads a file from the URL.
 *
 * @param uri
 */
export async function downloadFile<T = any>(uri: string): Promise<T> {
  return fetch(uri).then(res => res.json())
}
