import { createSignal, type Accessor } from 'solid-js';
import type { Size } from '../models/Geometry';

let shared: ScreenManager | undefined;

export class ScreenManager {
  static get shared() {
    if (!shared) {
      shared = new ScreenManager();
    }

    return shared;
  }

  desktopSize: Accessor<Size>;
  scale: Accessor<number>;
  screenBreakpoint: Accessor<'small' | 'medium' | 'large'>;

  constructor() {
    const smallBreakpoint = window.matchMedia('(max-width: 440px)');
    const mediumBreakpoint = window.matchMedia(
      '(min-width: 441px) and (max-width: 740px)',
    );
    const largeBreakpoint = window.matchMedia('(min-width: 741px)');

    const [desktopSize, setDesktopSize] = createSignal(this.#getDesktopSize());
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

    const observer = new ResizeObserver(() => {
      setDesktopSize(this.#getDesktopSize());
      setScale(this.#getScale());
    });
    observer.observe(document.documentElement);

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

  #getDesktopSize = () => {
    const element = document.getElementById('Wes95_Desktop');
    return {
      width: element?.clientWidth ?? 0,
      height: element?.clientHeight ?? 0,
    };
  };
}
