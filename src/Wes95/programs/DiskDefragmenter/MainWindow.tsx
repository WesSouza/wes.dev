import { createEffect, createSignal, For, onMount } from 'solid-js';
import { createStore } from 'solid-js/store';
import { ScreenManager } from '../../lib/ScreenManager';
import { WindowManager } from '../../lib/WindowManager';
import type { WindowState } from '../../models/WindowState';
import styles from './style.module.css';

export type ClusterState =
  | 'empty'
  | 'optimized'
  | 'beginning'
  | 'middle'
  | 'end'
  | 'system'
  | 'read'
  | 'write';

function makeCluster(position: 'beginning' | 'middle' | 'end'): ClusterState {
  const probability = Math.random();

  if (probability < 0.3) {
    return 'empty';
  } else if (probability < 0.9) {
    return position;
  }

  return 'system';
}

export function DiskDefragmenterMainWindow(p: { window: WindowState }) {
  const [progress, setProgress] = createSignal(0);
  const [paused, setPaused] = createSignal(false);
  const [disk, setDisk] = createStore<{
    clusters: ClusterState[];
  }>({ clusters: [] });

  onMount(() => {
    WindowManager.shared.setWindow(p.window.id, (window) => {
      window.title = `Defragmenting Drive C (paused)`;
      window.icon = 'iconDefrag';
    });

    const clusters: ClusterState[] = [];
    const size = 134217;
    const thirdSize = size / 3;
    const twoThirdSize = (size * 2) / 3;
    while (clusters.length < size) {
      const randomSequenceLength = Math.random() * 300;
      const cluster = makeCluster(
        clusters.length < thirdSize
          ? 'beginning'
          : clusters.length < twoThirdSize
            ? 'middle'
            : 'end',
      );
      for (let i = 0; i < randomSequenceLength; i++) {
        clusters.push(cluster);
      }
    }

    setDisk(() => ({ clusters }));
  });

  createEffect(() => {
    WindowManager.shared.setWindow(p.window.id, (window) => {
      window.rect = { x: 0, y: 0, ...ScreenManager.shared.desktopSize() };
    });
  });

  createEffect(() => {
    WindowManager.shared.setWindow(p.window.id, (window) => {
      window.title = `Defragmenting Drive C${paused() ? ' (paused)' : ''}`;
    });
  });

  const handleStopClick = () => {
    WindowManager.shared.closeWindow(p.window.id);
  };

  const handlePauseClick = () => {
    setProgress((progress) => ++progress);
    setPaused((paused) => !paused);
  };

  return (
    <>
      <div class="Field">
        <div class="Content">
          <For each={disk.clusters}>
            {(cluster) => (
              <div
                classList={{
                  [styles.Cluster!]: true,
                  [styles[`-${cluster}`]!]: true,
                }}
              ></div>
            )}
          </For>
        </div>
      </div>
      <div class="Horizontal MediumSpacing">
        <div class="Vertical SmallSpacing">
          <span>Reading drive information...</span>
          <span>[progress bar]</span>
          <span>${progress()}% complete</span>
        </div>

        <div class="Vertical SmallSpacing">
          <button class="Button" type="button" onClick={handleStopClick}>
            Stop
          </button>
          <button class="Button" type="button" onClick={handlePauseClick}>
            {paused() ? 'Resume' : 'Pause'}
          </button>
        </div>
      </div>
    </>
  );
}
