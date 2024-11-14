export function modifyById<T extends { id: string }>(
  id: string,
  array: T[],
  modifyFn: (item: T) => void,
) {
  for (let i = 0; i < array.length; i++) {
    const item = array[i]!;
    if (item.id === id) {
      modifyFn(item);
    }
  }
}

export function modifyByIds<T extends { id: string }>(
  ids: string[],
  array: T[],
  modifyFn: (item: T) => void,
) {
  for (let i = 0; i < array.length; i++) {
    const item = array[i]!;
    if (ids.includes(item.id)) {
      modifyFn(item);
    }
  }
}
