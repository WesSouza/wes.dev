import React, { MutableRefObject, useEffect, useRef } from 'react';

import { Sounds, SoundsSrcs } from '~/constants/Sounds';

interface Props {
  controller: MutableRefObject<SoundBlasterController | null>;
  sound: Sounds;
}

export class SoundBlasterController {
  constructor(public el: HTMLAudioElement | null = null) {}

  play() {
    if (!this.el) {
      return;
    }

    this.el.currentTime = 0;
    this.el.play();
  }

  pause() {
    if (!this.el) {
      return;
    }

    this.el.pause();
  }
}

export function SoundBlaster({ controller: controllerRef, sound }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement || !controllerRef) {
      return;
    }

    controllerRef.current = new SoundBlasterController(audioElement);
    return () => {
      if (controllerRef.current) {
        controllerRef.current.el = null;
      }
    };
  }, [controllerRef]);

  return <audio ref={audioRef} src={SoundsSrcs[sound]} />;
}
