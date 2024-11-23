import { createResizeObserver } from '@solid-primitives/resize-observer';
import { createEffect, createMemo, For, onCleanup, onMount } from 'solid-js';
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

const DefragSpeed = 200;
const DefragMaxContiguousClusters = 300;
const DefragMaxRead = 100;
const DefragMaxReadGroups = 6;
const DefragClustersCount = 134217;

function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

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
  const [state, setState] = createStore<{
    clusters: ClusterState[];
    clusterBuffer: number;
    columns: number;
    currentRow: number;
    currentState: 'neutral' | 'read' | 'write' | 'paused';
    paused: boolean;
    progress: number;
    rows: number;
    timer: number | undefined;
  }>({
    clusters: [],
    clusterBuffer: 0,
    columns: 0,
    currentRow: 0,
    currentState: 'neutral',
    paused: false,
    progress: 0,
    rows: 0,
    timer: undefined,
  });
  let clusterGridElement!: HTMLDivElement;

  onMount(() => {
    WindowManager.shared.setWindow(p.window.id, (window) => {
      window.title = `Defragmenting Drive C (paused)`;
      window.icon = 'iconDefrag';
    });

    const clusters: ClusterState[] = [];
    const size = DefragClustersCount;
    const thirdSize = size / 3;
    const twoThirdSize = (size * 2) / 3;
    while (clusters.length < size) {
      const randomSequenceLength = getRandomNumber(
        0,
        DefragMaxContiguousClusters,
      );
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

    setState('clusters', clusters);

    setState('timer', window.setInterval(loop, DefragSpeed));

    createResizeObserver(clusterGridElement, (rect) => {
      const { width, height } = rect;
      const scale = ScreenManager.shared.scale();

      setState('columns', Math.floor(width / (scale * 8)));
      setState('rows', Math.floor(height / (scale * 10)));
    });
  });

  const clustersOnScreen = createMemo(() => {
    const startCluster = state.currentRow * state.columns;
    return state.clusters.slice(
      startCluster,
      startCluster + state.columns * state.rows,
    );
  });

  createEffect(() => {
    WindowManager.shared.setWindow(p.window.id, (window) => {
      window.rect = { x: 0, y: 0, ...ScreenManager.shared.desktopSize() };
    });
  });

  createEffect(() => {
    WindowManager.shared.setWindow(p.window.id, (window) => {
      window.title = `Defragmenting Drive C${state.paused ? ' (paused)' : ''}`;
    });
  });

  onCleanup(() => {
    window.clearInterval(state.timer);
  });

  const handleStopClick = () => {
    WindowManager.shared.closeWindow(p.window.id);
  };

  const handlePauseClick = () => {
    setState('paused', (paused) => !paused);
    if (!state.paused) {
      setState('timer', window.setInterval(loop, DefragSpeed));
    } else {
      window.clearInterval(state.timer);
      setState('timer', undefined);
    }
  };

  const loop = () => {
    if (state.currentState === 'neutral' || state.currentState === 'write') {
      readClusters();
    } else if (state.currentState === 'read') {
      writeClusters();
    }
  };

  const findClusterIndicesByState = (states: ClusterState[]) => {
    return state.clusters
      .map((cluster, index) => (states.includes(cluster) ? index : null))
      .filter((cluster) => cluster !== null) as number[];
  };

  const updateOptimized = () => {
    const availableClusters = findClusterIndicesByState([
      'optimized',
      'system',
      'beginning',
      'middle',
      'end',
    ]);

    const startIndex = availableClusters.at(0);
    const endIndex = findClusterIndicesByState(['write']).at(-1);
    if (startIndex === undefined || endIndex === undefined) {
      return;
    }

    const indices = [];
    for (let i = startIndex; i <= endIndex; i++) {
      if (
        state.clusters[i] === 'beginning' ||
        state.clusters[i] === 'middle' ||
        state.clusters[i] === 'end' ||
        state.clusters[i] === 'write'
      ) {
        indices.push(i);
      }
    }

    setState('clusters', indices, 'optimized');

    const lastRow = indices.at(-1)! / state.columns;
    if (lastRow - state.currentRow > (state.rows * 4) / 5) {
      setState('currentRow', lastRow - Math.floor(state.rows / 5));
    }
  };

  const readClusters = () => {
    updateOptimized();
    setState('currentState', 'read');
    const availableClusters = findClusterIndicesByState([
      'beginning',
      'middle',
      'end',
    ]);
    const maxAvailableCluster = Math.min(
      availableClusters.length,
      state.rows * state.columns,
    );

    if (!availableClusters.length) {
      return;
    }

    const readGroups = getRandomNumber(1, DefragMaxReadGroups);
    for (let i = 0; i < readGroups; i++) {
      const clustersToRead = getRandomNumber(1, DefragMaxRead);
      const randomAvailableIndex = getRandomNumber(0, maxAvailableCluster);
      const lastContiguousReadableAvailableIndex = availableClusters.findIndex(
        (value, index, array) => {
          if (index <= randomAvailableIndex) {
            return false;
          }
          const nextValue = array[index + 1];
          return !nextValue || nextValue !== value + 1;
        },
      );

      const startIndex = availableClusters[randomAvailableIndex]!;
      const endIndex = startIndex + clustersToRead;
      const maxIndex = availableClusters[lastContiguousReadableAvailableIndex]!;

      setState(
        'clusters',
        {
          from: startIndex,
          to: Math.min(endIndex, maxIndex),
        },
        'read',
      );
    }
  };

  const writeClusters = () => {
    setState('currentState', 'write');
    const readClusters = findClusterIndicesByState(['read']);

    if (!readClusters.length) {
      return;
    }

    setState('clusters', readClusters, 'empty');

    const emptyClusters = findClusterIndicesByState(['empty']);
    const lastContiguousEmptyClusterIndex = emptyClusters.findIndex(
      (value, index, array) => {
        const nextValue = array[index + 1];
        return !nextValue || nextValue !== value + 1;
      },
    );

    const startIndex = emptyClusters[0]!;
    const endIndex = startIndex + readClusters.length;
    const maxIndex = emptyClusters[lastContiguousEmptyClusterIndex]!;

    setState(
      'clusters',
      {
        from: startIndex,
        to: Math.min(endIndex, maxIndex),
      },
      'write',
    );
  };

  return (
    <>
      <div class="Field">
        <div
          classList={{ Content: true, [styles.ClusterGrid!]: true }}
          ref={clusterGridElement}
        >
          <For each={clustersOnScreen()}>
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
          <span>${state.progress}% complete</span>
        </div>

        <div class="Vertical SmallSpacing">
          <button class="Button" type="button" onClick={handleStopClick}>
            Stop
          </button>
          <button class="Button" type="button" onClick={handlePauseClick}>
            {state.paused ? 'Resume' : 'Pause'}
          </button>
        </div>
      </div>
    </>
  );
}
