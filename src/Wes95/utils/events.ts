export const timers = new WeakMap<(event: unknown) => void, number>();

export const throttleEvent = <E>(handler: (event: E) => void) => {
  let timer: number;
  return (event: E) => {
    cancelAnimationFrame(timer);
    timer = requestAnimationFrame(() => handler(event));
  };
};
