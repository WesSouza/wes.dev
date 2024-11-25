import { createResizeObserver } from '@solid-primitives/resize-observer';
import { createEffect, createMemo, For, onCleanup, onMount } from 'solid-js';
import { createStore } from 'solid-js/store';
import { Progress } from '../../components/Progress';
import { ScreenManager } from '../../lib/ScreenManager';
import { WindowManager } from '../../lib/WindowManager';
import type { WindowState } from '../../models/WindowState';
import styles from './style.module.css';

export type ClusterState =
  | 'free'
  | 'optimized'
  | 'beginning'
  | 'middle'
  | 'end'
  | 'system'
  | 'read'
  | 'write';

const DefragSpeed = 150;
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
    return 'free';
  } else if (probability < 0.9) {
    return position;
  }

  return 'system';
}

export function DiskDefragmenterMainWindow(p: { window: WindowState }) {
  const [state, setState] = createStore<{
    clusters: ClusterState[];
    columns: number;
    currentRow: number;
    currentState: 'started' | 'read' | 'write' | 'finished';
    expandedReadOffset: number;
    paused: boolean;
    progress: number;
    rows: number;
    timer: number | undefined;
  }>({
    clusters: [],
    columns: 0,
    currentRow: 0,
    currentState: 'started',
    expandedReadOffset: 0,
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
    const desktopSize = ScreenManager.shared.desktopSize();
    if (!desktopSize) {
      return;
    }

    WindowManager.shared.setWindow(p.window.id, (window) => {
      window.rect = { x: 0, y: 0, ...desktopSize };
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

  const handleExitClick = () => {
    WindowManager.shared.closeWindow(p.window.id);
  };

  const handlePauseClick = () => {
    if (state.currentState === 'finished') {
      return;
    }

    setState('paused', (paused) => !paused);
    if (!state.paused) {
      setState('timer', window.setInterval(loop, DefragSpeed));
    } else {
      window.clearInterval(state.timer);
      setState('timer', undefined);
    }
  };

  const loop = () => {
    if (state.currentState === 'started' || state.currentState === 'write') {
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
    const availableClusters: number[] = [];
    let optimizedClusters: number = 0;
    let totalUsedClusters: number = 0;
    const clustersLength = state.clusters.length;
    const optimizedClustersSet = new Set([
      'optimized',
      'system',
      'beginning',
      'middle',
      'end',
    ]);

    for (let index = 0; index < clustersLength; index++) {
      const clusterState = state.clusters[index]!;
      if (optimizedClustersSet.has(clusterState)) {
        availableClusters.push(index);
      }
      if (clusterState === 'optimized' || clusterState === 'write') {
        optimizedClusters++;
      }
      if (clusterState !== 'free' && clusterState !== 'system') {
        totalUsedClusters++;
      }
    }

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

    const progress = optimizedClusters / totalUsedClusters;
    setState('progress', progress);
    if (progress === 1) {
      window.clearInterval(state.timer);
      setState('timer', undefined);
      setState('currentState', 'finished');
      WindowManager.shared.messageDialog({
        type: 'info',
        title: 'Finished',
        message: 'Disk defragmentation finished successfully.',
        parentId: p.window.id,
        onAction: () => {
          WindowManager.shared.closeWindow(p.window.id);
        },
      });
    }
  };

  const readClusters = () => {
    setState('currentState', 'read');

    updateOptimized();
    const availableClusters = findClusterIndicesByState([
      'beginning',
      'middle',
      'end',
    ]);
    const maxAvailableCluster = Math.min(
      availableClusters.length + 1,
      state.rows * state.columns + state.expandedReadOffset,
    );

    if (!maxAvailableCluster) {
      setState('expandedReadOffset', (expandedReadOffset) =>
        Math.min(
          availableClusters.length + 1,
          expandedReadOffset + state.rows * state.columns,
        ),
      );
      return;
    }

    if (availableClusters.length <= 100) {
      setState('clusters', availableClusters, 'read');
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

    setState('clusters', readClusters, 'free');

    const freeClusters = findClusterIndicesByState(['free']);
    const lastContiguousFreeClusterIndex = freeClusters.findIndex(
      (value, index, array) => {
        const nextValue = array[index + 1];
        return !nextValue || nextValue !== value + 1;
      },
    );

    const startIndex = freeClusters[0]!;
    const endIndex = startIndex + readClusters.length;
    const maxIndex = freeClusters[lastContiguousFreeClusterIndex]!;

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
      <div
        classList={{
          Horizontal: true,
          MediumSpacing: true,
          [styles.Progress!]: true,
        }}
      >
        <div
          classList={{
            Vertical: true,
            SmallSpacing: true,
            [styles.Status!]: true,
          }}
        >
          <span>
            {state.currentState !== 'finished'
              ? 'Defragmenting file system...'
              : 'Finished'}
          </span>
          <span>
            <Progress appearance="blocks" value={state.progress} />
          </span>
          <span>{Math.floor(state.progress * 100)}% complete</span>
        </div>

        <div
          classList={{
            Vertical: true,
            SmallSpacing: true,
            [styles.Buttons!]: true,
          }}
        >
          <button class="Button" type="button" onClick={handleExitClick}>
            Exit
          </button>
          <button
            class="Button"
            disabled={state.currentState === 'finished'}
            type="button"
            onClick={handlePauseClick}
          >
            {state.paused ? 'Resume' : 'Pause'}
          </button>
        </div>
      </div>
    </>
  );
}
