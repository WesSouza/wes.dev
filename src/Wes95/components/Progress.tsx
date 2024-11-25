import { createResizeObserver } from '@solid-primitives/resize-observer';
import { createMemo, createSignal, For, onMount, Show } from 'solid-js';
import { ScreenManager } from '../lib/ScreenManager';
import styles from './Progress.module.css';

export function Progress(p: {
  appearance: 'blocks' | 'solid';
  id?: string | undefined;
  showNumber?: boolean | undefined;
  value: number;
}) {
  let element!: HTMLDivElement;
  const [segments, setSegments] = createSignal<number>(1);
  const appearance = () => p.appearance ?? 'solid';

  onMount(() => {
    createResizeObserver(element, (rect) => {
      const scale = ScreenManager.shared.scale();
      setSegments(Math.floor((rect.width - 4 * scale) / (10 * scale)));
    });
  });

  const segmentBlocks = createMemo(() => {
    const progress = Math.floor(segments() * p.value);
    return Array.from({ length: progress }, () => '');
  });

  return (
    <div
      classList={{
        Field: true,
        [styles.Progress!]: true,
        [styles['-blocks']!]: appearance() === 'blocks',
        [styles['-solid']!]: appearance() === 'solid',
      }}
      style={{
        '--percentage': `${p.value * 100}%`,
        '--segments': segments(),
      }}
      ref={element}
    >
      <progress id={p.id} value={p.value} max="1">
        {(p.value * 100).toFixed(0)}%
      </progress>
      <Show when={appearance() === 'blocks'}>
        <For each={segmentBlocks()}>
          {() => <div class={styles.ProgressSegment!} />}
        </For>
      </Show>
      <Show when={appearance() === 'solid' && p.showNumber}>
        <div class={styles.ProgressNumber}>{(p.value * 100).toFixed(0)}%</div>
        <div class={styles.ProgressNumberInverted}>
          {(p.value * 100).toFixed(0)}%
        </div>
      </Show>
    </div>
  );
}
