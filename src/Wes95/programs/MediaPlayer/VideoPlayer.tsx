import { onCleanup } from 'solid-js';
import { createStore, type SetStoreFunction } from 'solid-js/store';

export type VideoPlayerState = {
  currentTime: number | undefined;
  duration: number | undefined;
  status: 'play' | 'pause' | 'stop' | 'loading' | 'empty';
};

export class VideoPlayer {
  #videoRef: HTMLVideoElement | undefined;
  #url: URL;
  #type: 'html5' | 'youtube' | 'vimeo' | undefined;
  state: VideoPlayerState;
  #setState: SetStoreFunction<VideoPlayerState>;

  constructor(url: string) {
    const state = createStore<VideoPlayerState>({
      currentTime: undefined,
      duration: undefined,
      status: 'empty',
    });
    this.#url = new URL(url);
    this.state = state[0];
    this.#setState = state[1];

    if (/\.(m3u8|mp4)$/.test(this.#url.pathname)) {
      this.#type = 'html5';
    } else if (
      this.#url.hostname === 'youtube.com' ||
      this.#url.hostname === 'www.youtube.com' ||
      this.#url.hostname === 'youtu.be'
    ) {
      this.#type = 'youtube';
    } else if (
      this.#url.hostname === 'vimeo.com' ||
      this.#url.hostname === 'www.vimeo.com'
    ) {
      this.#type = 'vimeo';
    }

    onCleanup(() => {
      this.unsetVideoRef();
    });
  }

  handleDurationChange = (event: Event) => {
    console.log('DurationChange');
  };

  handleLoadStart = (event: Event) => {
    console.log('LoadStart');
  };

  handleProgress = (event: Event) => {
    console.log('Progress');
  };

  handleTimeUpdate = (event: Event) => {
    console.log('TimeUpdate');
  };

  setVideoRef = (ref: HTMLVideoElement) => {
    this.#videoRef = ref;
    ref.addEventListener('durationchange', this.handleDurationChange);
    ref.addEventListener('loadstart', this.handleProgress);
    ref.addEventListener('progress', this.handleProgress);
    ref.addEventListener('timeupdate', this.handleTimeUpdate);
  };

  unsetVideoRef = () => {
    if (!this.#videoRef) {
      return;
    }

    this.#videoRef.removeEventListener(
      'durationchange',
      this.handleDurationChange,
    );
    this.#videoRef.removeEventListener('loadstart', this.handleProgress);
    this.#videoRef.removeEventListener('progress', this.handleProgress);
    this.#videoRef.removeEventListener('timeupdate', this.handleTimeUpdate);
  };

  getElement = () => {
    switch (this.#type) {
      case 'html5': {
        return (
          <video ref={this.setVideoRef} src={this.#url.toString()}></video>
        );
      }
    }
  };
}
