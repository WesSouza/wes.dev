/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface Window {
  onYouTubeIframeAPIReady: () => void;
}

type LanguageModelAvailability =
  | 'available'
  | 'downloadable'
  | 'downloading'
  | 'unavailable';

type LanguageModelPrompt = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

type LanguageModelOptions = {
  expectedInputs?: Array<{ type: 'text'; languages: string[] }>;
  expectedOutputs?: Array<{ type: 'text'; languages: string[] }>;
  initialPrompts?: LanguageModelPrompt[];
  monitor?: (monitor: CreateMonitor) => void;
};

type LanguageModelSession = {
  promptStreaming(text: string): AsyncIterable<string>;
};

interface CreateMonitor extends EventTarget {
  addEventListener(
    type: 'downloadprogress',
    listener: (event: ProgressEvent<CreateMonitor>) => void,
    options?: AddEventListenerOptions | boolean,
  ): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject | null,
    options?: AddEventListenerOptions | boolean,
  ): void;
  removeEventListener(
    type: 'downloadprogress',
    listener: (event: ProgressEvent<CreateMonitor>) => void,
    options?: EventListenerOptions | boolean,
  ): void;
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject | null,
    options?: EventListenerOptions | boolean,
  ): void;
}

type LanguageModelApi = {
  availability(options?: LanguageModelOptions): Promise<LanguageModelAvailability>;
  create(options?: LanguageModelOptions): Promise<LanguageModelSession>;
};

declare const LanguageModel: LanguageModelApi;

interface ImportMetaEnv {
  readonly PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN?: string;
}

declare namespace YT {
  export type Player = import('youtube').Player;
}
