import { onCleanup, onMount } from 'solid-js';
import { WES95_MEDIA_PATH } from '../../config';
import { collect } from '../../utils/plausible';

export function createDinger() {
  let buffer: AudioBuffer | undefined;
  let source: AudioBufferSourceNode | undefined;

  const context = new AudioContext();

  onMount(() => {
    const abortController = new AbortController();

    fetch(WES95_MEDIA_PATH + '/Ding.mp3', { signal: abortController.signal })
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => context.decodeAudioData(arrayBuffer))
      .then((audioBuffer) => {
        buffer = audioBuffer;
      });

    onCleanup(() => {
      abortController.abort();
    });
  });

  return () => {
    if (!buffer || !context) {
      return;
    }

    if (source) {
      source.stop();
    }

    source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    source.start();

    collect('Sound Played', { sound: 'Ding' });
  };
}
