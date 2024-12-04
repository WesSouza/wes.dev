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

export function createVideoPlayer(urlString: string | undefined) {
  const videoId = createUniqueId();

  let containerRef: HTMLDivElement | undefined;
  let containerSize: Size | undefined;
  let videoRef: HTMLVideoElement | undefined;
  let youtubePlayer: YT.Player | undefined;
  let youtubeTimeTimer: number | undefined;

  const [state, setState] = createStore<VideoPlayerState>({
    currentTime: undefined,
    duration: undefined,
    status: 'empty',
  });

  const url = createMemo(() => (urlString ? new URL(urlString) : undefined));

  const type = createMemo(() => {
    if (/\.(m3u8|mp4)$/.test(url()?.pathname ?? '')) {
      return 'html5';
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
      youtubePlayer = new YT.Player(videoId, {
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
    setState('duration', videoRef?.duration);
  };

  const handleEnded = () => {
    setState('status', 'stop');
  };

  const handleLoadStart = () => {
    setState('status', 'loading');
  };

  const handlePause = () => {
    setState('status', videoRef?.currentTime === 0 ? 'stop' : 'pause');
  };

  const handlePlay = () => {
    setState('status', 'play');
  };

  const handleTimeUpdate = () => {
    if (videoRef?.currentTime === 0 && videoRef.paused) {
      setState('status', 'stop');
    }
    setState('currentTime', videoRef?.currentTime);
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

  const setVideoRef = (ref: HTMLVideoElement) => {
    videoRef = ref;
    ref.addEventListener('durationchange', handleDurationChange);
    ref.addEventListener('ended', handleEnded);
    ref.addEventListener('loadstart', handleLoadStart);
    ref.addEventListener('pause', handlePause);
    ref.addEventListener('play', handlePlay);
    ref.addEventListener('progress', handleProgress);
    ref.addEventListener('timeupdate', handleTimeUpdate);
  };

  const unsetVideoRef = () => {
    if (!videoRef) {
      return;
    }

    videoRef.removeEventListener('durationchange', handleDurationChange);
    videoRef.removeEventListener('ended', handleEnded);
    videoRef.removeEventListener('loadstart', handleLoadStart);
    videoRef.removeEventListener('pause', handlePause);
    videoRef.removeEventListener('play', handlePlay);
    videoRef.removeEventListener('progress', handleProgress);
    videoRef.removeEventListener('timeupdate', handleTimeUpdate);
  };

  const element = createMemo(() => {
    if (!url()) {
      return <></>;
    }

    switch (type()) {
      case 'html5': {
        return (
          <video
            id={videoId}
            playsinline
            ref={setVideoRef}
            src={url()?.toString()}
          ></video>
        );
      }
      case 'youtube': {
        return <div id={videoId}></div>;
      }
    }

    return <></>;
  });

  const fastForward = () => {
    if (videoRef) {
      videoRef.currentTime += 15;
    }

    if (youtubePlayer) {
      const currentTime = youtubePlayer.getCurrentTime();
      if (currentTime) {
        youtubePlayer.seekTo(currentTime + 15, true);
      }
    }
  };

  const pause = () => {
    if (videoRef) {
      videoRef.pause();
    }

    if (youtubePlayer) {
      youtubePlayer.pauseVideo();
    }
  };

  const play = () => {
    if (videoRef) {
      videoRef.play();
    }

    if (youtubePlayer) {
      youtubePlayer.playVideo();
    }
  };

  const rewind = () => {
    if (videoRef) {
      videoRef.currentTime -= 15;
    }

    if (youtubePlayer) {
      const currentTime = youtubePlayer.getCurrentTime();
      if (currentTime) {
        youtubePlayer.seekTo(currentTime - 15, true);
      }
    }
  };

  const seek = (time: number) => {
    if (videoRef) {
      videoRef.currentTime = time;
    }

    if (youtubePlayer) {
      youtubePlayer.seekTo(time, true);
    }
  };

  const skipBack = () => {
    if (videoRef) {
      videoRef.currentTime = 0;
    }

    if (youtubePlayer) {
      youtubePlayer.seekTo(0, true);
    }
  };

  const skipForward = () => {
    if (videoRef) {
      videoRef.currentTime = videoRef.duration - 5;
    }

    if (youtubePlayer) {
      const duration = youtubePlayer.getDuration();
      if (duration) {
        youtubePlayer.seekTo(duration - 5, true);
      }
    }
  };

  const stop = () => {
    if (videoRef) {
      videoRef.currentTime = 0;
      videoRef.pause();
    }

    if (youtubePlayer) {
      youtubePlayer.stopVideo();
    }
  };

  return {
    element,
    fastForward,
    pause,
    play,
    rewind,
    seek,
    setContainerRef,
    skipBack,
    skipForward,
    state,
    stop,
  };
}
