/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface Window {
  onYouTubeIframeAPIReady: () => void;
}

declare namespace YT {
  export type Player = import('youtube').Player;
}
