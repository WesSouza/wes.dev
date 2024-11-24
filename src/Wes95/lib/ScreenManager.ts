import { createSignal, onMount, type Accessor } from 'solid-js';
import type { Size } from '../models/Geometry';
import { createResizeObserver } from '@solid-primitives/resize-observer';

let shared: ScreenManager | undefined;

export class ScreenManager {
  static get shared() {
    if (!shared) {
      shared = new ScreenManager();
    }

    return shared;
  }

  desktopSize: Accessor<Size | undefined>;
  scale: Accessor<number>;
  screenBreakpoint: Accessor<'small' | 'medium' | 'large'>;

  constructor() {
    const smallBreakpoint = window.matchMedia('(max-width: 440px)');
    const mediumBreakpoint = window.matchMedia(
      '(min-width: 441px) and (max-width: 740px)',
    );
    const largeBreakpoint = window.matchMedia('(min-width: 741px)');

    const [desktopSize, setDesktopSize] = createSignal<Size | undefined>();
    const [screenBreakpoint, setScreenBreakpoint] = createSignal<
      'small' | 'medium' | 'large'
    >(
      smallBreakpoint.matches
        ? 'small'
        : mediumBreakpoint.matches
          ? 'medium'
          : 'large',
    );
    const [scale, setScale] = createSignal(this.#getScale());

    this.desktopSize = desktopSize;
    this.scale = scale;
    this.screenBreakpoint = screenBreakpoint;

    onMount(() => {
      createResizeObserver(
        document.getElementById('Wes95_Desktop'),
        (desktopRect) => {
          setDesktopSize({
            width: desktopRect.width,
            height: desktopRect.height,
          });
          setScale(this.#getScale());
        },
      );
    });

    smallBreakpoint.addEventListener('change', (event) => {
      if (event.matches) {
        setScreenBreakpoint('small');
      }
    });
    mediumBreakpoint.addEventListener('change', (event) => {
      if (event.matches) {
        setScreenBreakpoint('medium');
      }
    });
    largeBreakpoint.addEventListener('change', (event) => {
      if (event.matches) {
        setScreenBreakpoint('large');
      }
    });
  }

  #getScale = () => {
    const scale =
      getComputedStyle(document.documentElement).getPropertyValue(
        '--wes95-scale-value',
      ) ?? '0';
    return parseInt(scale);
  };
}
