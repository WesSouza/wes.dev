/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface Plausible {
  (...args: any[]): void;
  q: IArguments[];
}

interface Window {
  onYouTubeIframeAPIReady: () => void;
  plausible: Plausible;
}
