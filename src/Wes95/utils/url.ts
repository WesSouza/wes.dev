export function getHostname(url: string) {
  return new URL(url).hostname;
}
