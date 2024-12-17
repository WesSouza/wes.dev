export function collect(eventName: string, props: Record<string, any> = {}) {
  try {
    window.plausible?.(eventName, { props });
  } catch {
    /* empty */
  }
}
