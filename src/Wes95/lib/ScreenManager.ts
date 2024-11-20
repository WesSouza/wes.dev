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

  scale: Accessor<number>;
  desktopSize: Accessor<Size>;

  constructor() {
    const [desktopSize, setDesktopSize] = createSignal(this.#getDesktopSize());
    const [scale, setScale] = createSignal(this.#getScale());

    this.scale = scale;
    this.desktopSize = desktopSize;

    const observer = new ResizeObserver(() => {
      setDesktopSize(this.#getDesktopSize());
      setScale(this.#getScale());
    });
    observer.observe(document.documentElement);
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
