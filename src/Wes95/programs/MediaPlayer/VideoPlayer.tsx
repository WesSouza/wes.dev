import { createMemo, onCleanup } from 'solid-js';
import { createStore } from 'solid-js/store';

export type VideoPlayerState = {
  currentTime: number | undefined;
  duration: number | undefined;
  status: 'play' | 'pause' | 'stop' | 'loading' | 'empty';
};

export function createVideoPlayer(urlString: string | undefined) {
  let videoRef: HTMLVideoElement | undefined;

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

  onCleanup(() => {
    unsetVideoRef();
  });

  const handleProgress = () => {
    console.log('Progress', state.status);
    if (state.status === 'empty' || state.status === 'loading') {
      setState('status', 'pause');
    }
  };

  const handleDurationChange = () => {
    setState('duration', videoRef?.duration);
  };

  const handleEnded = () => {
    setState('status', 'stop');
    console.log('Ended');
  };

  const handleLoadStart = () => {
    setState('status', 'loading');
    console.log('LoadStart');
  };

  const handlePause = () => {
    setState('status', videoRef?.currentTime === 0 ? 'stop' : 'pause');
    console.log('Pause');
  };

  const handlePlay = () => {
    setState('status', 'play');
    console.log('Play');
  };

  const handleTimeUpdate = () => {
    if (videoRef?.currentTime === 0 && videoRef.paused) {
      setState('status', 'stop');
    }
    setState('currentTime', videoRef?.currentTime);
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
          <video playsinline ref={setVideoRef} src={url()?.toString()}></video>
        );
      }
    }

    return <></>;
  });

  const fastForward = () => {
    if (!videoRef) {
      return;
    }

    videoRef.currentTime += 15;
  };

  const pause = () => {
    if (!videoRef) {
      return;
    }

    videoRef.pause();
  };

  const play = () => {
    if (!videoRef) {
      return;
    }

    videoRef.play();
  };

  const rewind = () => {
    if (!videoRef) {
      return;
    }

    videoRef.currentTime -= 15;
  };

  const seek = (time: number) => {
    if (!videoRef) {
      return;
    }

    videoRef.currentTime = time;
  };

  const skipBack = () => {
    if (!videoRef) {
      return;
    }

    videoRef.currentTime = 0;
  };

  const skipForward = () => {
    if (!videoRef) {
      return;
    }
    videoRef.currentTime = videoRef.duration - 5;
  };

  const stop = () => {
    if (!videoRef) {
      return;
    }

    videoRef.currentTime = 0;
    videoRef.pause();
  };

  return {
    element,
    fastForward,
    pause,
    play,
    rewind,
    seek,
    skipBack,
    skipForward,
    state,
    stop,
  };
}
