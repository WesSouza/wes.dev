export function modifyById<T extends { id: string }>(
  id: string,
  array: T[],
  modifyFn: (item: T) => T,
) {
  return array.map((item) => (item.id === id ? modifyFn(item) : item));
}

export function modifyByIds<T extends { id: string }>(
  ids: string[],
  array: T[],
  modifyFn: (item: T) => T,
) {
  return array.map((item) => (ids.includes(item.id) ? modifyFn(item) : item));
}
