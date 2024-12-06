import { createResizeObserver } from '@solid-primitives/resize-observer';
import {
  createEffect,
  createMemo,
  createUniqueId,
  onCleanup,
  onMount,
} from 'solid-js';
import { createStore, produce } from 'solid-js/store';
import type { Size } from '../../models/Geometry';
import { getRealPublicURL } from '../../utils/url';

let youtubeInjected = false;

let youtubeLoadedResolve: () => void;
const youtubeLoadedPromise = new Promise<void>((resolve) => {
  youtubeLoadedResolve = resolve;
});

export type VideoPlayerState = {
  currentTime: number | undefined;
  duration: number | undefined;
  status: 'play' | 'pause' | 'stop' | 'loading' | 'empty';
};

export function createMediaPlayer(urlString: string | undefined) {
  const elementId = createUniqueId();

  let containerRef: HTMLDivElement | undefined;
  let containerSize: Size | undefined;
  let elementRef: HTMLAudioElement | HTMLVideoElement | undefined;
  let youtubePlayer: YT.Player | undefined;
  let youtubeTimeTimer: number | undefined;

  const [state, setState] = createStore<VideoPlayerState>({
    currentTime: undefined,
    duration: undefined,
    status: 'empty',
  });

  const url = createMemo(() => getRealPublicURL(urlString));

  const type = createMemo(() => {
    if (/\.(mp3|m4a)$/.test(url()?.pathname ?? '')) {
      return 'html5-audio';
    } else if (/\.(m3u8|mp4)$/.test(url()?.pathname ?? '')) {
      return 'html5-video';
    } else if (
      url()?.hostname === 'youtube.com' ||
      url()?.hostname === 'www.youtube.com' ||
      url()?.hostname === 'youtu.be'
    ) {
      return 'youtube';
    } else if (
      url()?.hostname === 'vimeo.com' ||
      url()?.hostname === 'www.vimeo.com'
    ) {
      return 'vimeo';
    }

    return undefined;
  });

  onMount(() => {
    if (!youtubeInjected) {
      youtubeInjected = true;
      const tag = document.createElement('script');

      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0]!;
      firstScriptTag.parentNode!.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        youtubeLoadedResolve();
      };
    }

    createResizeObserver(containerRef, (size) => {
      containerSize = size;
      if (youtubePlayer) {
        youtubePlayer.setSize(size.width, size.height);
      }
    });
  });

  createEffect(() => {
    const typeValue = type();
    const urlValue = url();
    if (!containerRef || typeValue !== 'youtube' || !urlValue) {
      return;
    }

    const youtubeId =
      urlValue.hostname === 'youtu.be'
        ? urlValue.pathname
        : urlValue.searchParams.get('v');

    if (!youtubeId) {
      return;
    }

    const start = Number(urlValue.searchParams.get('t'));

    setState('status', 'loading');

    youtubeLoadedPromise.then(() => {
      youtubePlayer = new YT.Player(elementId, {
        videoId: youtubeId,
        width: containerSize?.width,
        height: containerSize?.height,
        playerVars: {
          controls: 0,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
          showinfo: 0,
          start,
        },
        events: {
          onReady: () => {
            setState(
              produce((state) => {
                state.currentTime = youtubePlayer?.getCurrentTime();
                state.duration = youtubePlayer?.getDuration();
                state.status = state.currentTime === 0 ? 'stop' : 'pause';
              }),
            );
          },
          onStateChange: (event) => {
            if (event.data === YT.PlayerState.PLAYING) {
              setState('status', 'play');
            } else if (
              event.data === YT.PlayerState.PAUSED ||
              event.data === YT.PlayerState.CUED
            ) {
              setState('status', 'pause');
            } else if (event.data === YT.PlayerState.ENDED) {
              setState('status', 'stop');
            }

            if (event.data === YT.PlayerState.PLAYING) {
              window.setInterval(youtubeTimeUpdate, 1000);
            } else {
              window.clearInterval(youtubeTimeTimer);
            }
          },
        },
      });
    });
  });

  onCleanup(() => {
    unsetVideoRef();
    window.clearInterval(youtubeTimeTimer);
  });

  const handleProgress = () => {
    if (state.status === 'empty' || state.status === 'loading') {
      setState('status', 'pause');
    }
  };

  const handleDurationChange = () => {
    setState('duration', elementRef?.duration);
  };

  const handleEnded = () => {
    setState('status', 'stop');
  };

  const handleLoadStart = () => {
    setState('status', 'loading');
  };

  const handlePause = () => {
    setState('status', elementRef?.currentTime === 0 ? 'stop' : 'pause');
  };

  const handlePlay = () => {
    setState('status', 'play');
  };

  const handleTimeUpdate = () => {
    if (elementRef?.currentTime === 0 && elementRef.paused) {
      setState('status', 'stop');
    }
    setState('currentTime', elementRef?.currentTime);
  };

  const youtubeTimeUpdate = () => {
    if (!youtubePlayer) {
      return;
    }

    setState(
      produce((state) => {
        state.currentTime = youtubePlayer?.getCurrentTime();
        state.duration = youtubePlayer?.getDuration();
      }),
    );
  };

  const setContainerRef = (ref: HTMLDivElement) => {
    containerRef = ref;
  };

  const setVideoRef = (ref: HTMLAudioElement | HTMLVideoElement) => {
    elementRef = ref;
    ref.addEventListener('durationchange', handleDurationChange);
    ref.addEventListener('ended', handleEnded);
    ref.addEventListener('loadstart', handleLoadStart);
    ref.addEventListener('pause', handlePause);
    ref.addEventListener('play', handlePlay);
    ref.addEventListener('progress', handleProgress);
    ref.addEventListener('timeupdate', handleTimeUpdate);
  };

  const unsetVideoRef = () => {
    if (!elementRef) {
      return;
    }

    elementRef.removeEventListener('durationchange', handleDurationChange);
    elementRef.removeEventListener('ended', handleEnded);
    elementRef.removeEventListener('loadstart', handleLoadStart);
    elementRef.removeEventListener('pause', handlePause);
    elementRef.removeEventListener('play', handlePlay);
    elementRef.removeEventListener('progress', handleProgress);
    elementRef.removeEventListener('timeupdate', handleTimeUpdate);
  };

  const fastForward = () => {
    if (elementRef) {
      elementRef.currentTime += 15;
    }

    if (youtubePlayer) {
      const currentTime = youtubePlayer.getCurrentTime();
      if (currentTime) {
        youtubePlayer.seekTo(currentTime + 15, true);
      }
    }
  };

  const fullscreen = () => {
    if (elementRef) {
      elementRef.requestFullscreen().catch(console.error);
    }
  };

  const pause = () => {
    if (elementRef) {
      elementRef.pause();
    }

    if (youtubePlayer) {
      youtubePlayer.pauseVideo();
    }
  };

  const play = () => {
    if (elementRef) {
      elementRef.play();
    }

    if (youtubePlayer) {
      youtubePlayer.playVideo();
    }
  };

  const rewind = () => {
    if (elementRef) {
      elementRef.currentTime -= 15;
    }

    if (youtubePlayer) {
      const currentTime = youtubePlayer.getCurrentTime();
      if (currentTime) {
        youtubePlayer.seekTo(currentTime - 15, true);
      }
    }
  };

  const seek = (time: number) => {
    if (elementRef) {
      elementRef.currentTime = time;
    }

    if (youtubePlayer) {
      youtubePlayer.seekTo(time, true);
    }
  };

  const skipBack = () => {
    if (elementRef) {
      elementRef.currentTime = 0;
    }

    if (youtubePlayer) {
      youtubePlayer.seekTo(0, true);
    }
  };

  const skipForward = () => {
    if (elementRef) {
      elementRef.currentTime = elementRef.duration - 5;
    }

    if (youtubePlayer) {
      const duration = youtubePlayer.getDuration();
      if (duration) {
        youtubePlayer.seekTo(duration - 5, true);
      }
    }
  };

  const stop = () => {
    if (elementRef) {
      elementRef.currentTime = 0;
      elementRef.pause();
    }

    if (youtubePlayer) {
      youtubePlayer.stopVideo();
    }
  };

  const togglePlayback = () => {
    if (elementRef) {
      if (elementRef.paused) {
        elementRef.play();
      } else {
        elementRef.pause();
      }
    }

    if (youtubePlayer) {
      if (state.status === 'play') {
        youtubePlayer.pauseVideo();
      } else {
        youtubePlayer.playVideo();
      }
    }
  };

  const element = createMemo(() => {
    if (!url()) {
      return <></>;
    }

    switch (type()) {
      case 'html5-audio': {
        return (
          <audio
            id={elementId}
            ref={setVideoRef}
            src={url()?.toString()}
            onClick={togglePlayback}
          ></audio>
        );
      }
      case 'html5-video': {
        return (
          <video
            id={elementId}
            playsinline
            ref={setVideoRef}
            src={url()?.toString()}
            onClick={togglePlayback}
          ></video>
        );
      }
      case 'youtube': {
        return <div id={elementId}></div>;
      }
    }

    return <></>;
  });

  return {
    element,
    fastForward,
    fullscreen,
    pause,
    play,
    rewind,
    seek,
    setContainerRef,
    skipBack,
    skipForward,
    state,
    stop,
    togglePlayback,
  };
}
