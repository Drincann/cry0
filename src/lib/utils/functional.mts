export function toMap<T, K, V>(
  items: T[],
  keyExector: (item: T) => K,
  valueExecutor: (item: T) => V
): Map<K, V> {

  const map = new Map<K, V>()
  items.forEach(item => {
    map.set(keyExector(item), valueExecutor(item))
  })

  return map
}

export function identity<T>(): (value: T) => T {
  return v => v
}
