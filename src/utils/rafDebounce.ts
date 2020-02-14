// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Procedure = (...args: any[]) => void;

export function rafDebounce<T extends Procedure>(callback: T) {
  let timeout: number;
  return (...args: Parameters<T>) => {
    if (timeout) {
      window.cancelAnimationFrame(timeout);
    }
    timeout = requestAnimationFrame(() => {
      callback(...args);
    });
  };
}
