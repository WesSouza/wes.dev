export function classList(
  classNames:
    | (undefined | string | { [k: string]: boolean | undefined })[]
    | { [k: string]: boolean | undefined },
): { [k: string]: boolean | undefined } {
  if (Array.isArray(classNames)) {
    return classNames.reduce<{ [k: string]: boolean | undefined }>(
      (classNames, className) => {
        if (typeof className === 'string') {
          return { ...classNames, [className]: true };
        }
        return { ...classNames, ...className };
      },
      {},
    );
  }

  return classNames;
}
