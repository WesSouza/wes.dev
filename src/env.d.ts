/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface Window {
  onYouTubeIframeAPIReady: () => void;
}

interface ImportMetaEnv {
  readonly PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN?: string;
}

declare namespace YT {
  export type Player = import('youtube').Player;
}
