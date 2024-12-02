import {
  createEffect,
  createResource,
  createUniqueId,
  onMount,
} from 'solid-js';
import { MenuBar } from '../../components/MenuBar';
import { Symbol } from '../../components/Symbol';
import { FileSystemManager } from '../../lib/FileSystemManager';
import { WindowManager } from '../../lib/WindowManager';
import type { WindowState } from '../../models/WindowState';
import { FSOpenEventSchema } from '../../system/FileSystem/registry';
import { createWindowURL } from '../../utils/Windows';
import type { MediaPlayerMainData } from './registry';
import styles from './style.module.css';

export function MediaPlayerMainWindow(p: {
  data: MediaPlayerMainData;
  window: WindowState;
}) {
  const fileSystem = FileSystemManager.shared;

  const [file] = createResource(p.data.file, fileSystem.getFile);
  const [fileData] = createResource(p.data.file, fileSystem.readFile);

  onMount(() => {
    WindowManager.shared.init(p.window.id, {
      icon: 'iconMplayer',
    });
  });

  createEffect(() => {
    WindowManager.shared.setWindow(p.window.id, (window) => {
      window.title = `${file()?.name ?? 'Untitled'} - Media Player`;
    });
  });

  const openFileDialog = () => {
    const delegateId = createUniqueId();
    WindowManager.shared.addWindow(
      createWindowURL('system://FileSystem/Open', {
        delegateId,
        fileTypes: ['midi', 'wave'],
      }),
      {
        active: true,
        parentId: p.window.id,
      },
    );

    WindowManager.shared.handleOnce(
      delegateId,
      (event) => {
        if (event.filePath) {
          WindowManager.shared.replaceWindow(
            p.window.id,
            `app://MediaPlayer/Main?file=${encodeURIComponent(event.filePath)}`,
          );
        }
        WindowManager.shared.setActiveWindow(p.window);
      },
      FSOpenEventSchema,
    );
  };

  const handleMenuSelect = (id: string) => {
    if (id === 'Open') {
      openFileDialog();
    }

    if (id === 'Exit') {
      WindowManager.shared.closeWindow(p.window.id);
    }
  };

  const handlePlay = () => {};

  const handlePause = () => {};

  const handleStop = () => {};

  const handleSkipBack = () => {};

  const handleSkipForward = () => {};

  return (
    <>
      <MenuBar
        items={[
          {
            type: 'item',
            id: 'File',
            label: 'File',
            submenu: [
              {
                type: 'item',
                id: 'Open',
                label: 'Open...',
              },
              {
                type: 'item',
                id: 'Close',
                label: 'Close',
              },
              {
                type: 'item',
                id: 'SaveAs',
                label: 'Save As...',
              },
              {
                type: 'separator',
              },
              {
                type: 'item',
                id: 'Properties',
                label: 'Properties',
              },
              {
                type: 'separator',
              },
              {
                type: 'item',
                id: 'Exit',
                label: 'Exit',
              },
            ],
          },
          {
            type: 'item',
            id: 'View',
            label: 'View',
            submenu: [
              {
                type: 'item',
                id: 'FullScreen',
                label: 'Full Screen',
              },
              {
                type: 'item',
                id: 'Zoom',
                label: 'Zoom',
                submenu: [],
              },
              {
                type: 'separator',
              },
              {
                type: 'item',
                id: 'Statistics',
                label: 'Statistics',
              },
              {
                type: 'separator',
              },
              {
                type: 'item',
                id: 'Settings',
                label: 'Settings',
                submenu: [],
              },
              {
                type: 'separator',
              },
              {
                type: 'item',
                id: 'Captions',
                label: 'Captions',
              },
              {
                type: 'item',
                id: 'Options',
                label: 'Options...',
              },
            ],
          },
          {
            type: 'item',
            id: 'Play',
            label: 'Play',
            submenu: [
              {
                type: 'item',
                id: 'PlayPause',
                label: 'Play/Pause',
              },
              {
                type: 'item',
                id: 'Stop',
                label: 'Stop',
              },
              {
                type: 'separator',
              },
              {
                type: 'item',
                id: 'SkipBack',
                label: 'Skip Back',
              },
              {
                type: 'item',
                id: 'SkipForward',
                label: 'Skip Forward',
              },
              {
                type: 'item',
                id: 'Rewind',
                label: 'Rewind',
              },
              {
                type: 'item',
                id: 'FastForward',
                label: 'Fast Forward',
              },
              {
                type: 'separator',
              },
              {
                type: 'item',
                id: 'Preview',
                label: 'Preview',
              },
              {
                type: 'item',
                id: 'GoTo',
                label: 'Go to...',
              },
              {
                type: 'separator',
              },
              {
                type: 'item',
                id: 'Language',
                label: 'Language',
                submenu: [],
              },
              {
                type: 'item',
                id: 'Volume',
                label: 'Volume',
                submenu: [],
              },
            ],
          },
          {
            type: 'item',
            id: 'Help',
            label: 'Help',
            submenu: [
              {
                type: 'item',
                id: 'About',
                label: 'About Media Player',
              },
            ],
          },
        ]}
        onSelect={handleMenuSelect}
      />
      <div class={'StatusField ' + styles.Video}>Video</div>
      <div class={styles.Controls}>
        <div class={styles.Timeline}>
          <input type="range" />
        </div>
        <div class={styles.Buttons}>
          <button
            class={'ThinButton -active ' + styles.Button}
            onClick={handlePlay}
            type="button"
          >
            <Symbol symbol="mediaPlay" />
          </button>
          <button
            class={'ThinButton ' + styles.Button}
            onClick={handlePause}
            type="button"
          >
            <Symbol symbol="mediaPause" />
          </button>
          <button
            class={'ThinButton ' + styles.Button}
            onClick={handleStop}
            type="button"
          >
            <Symbol symbol="mediaStop" />
          </button>
          <div class="VerticalSeparator"></div>
          <button
            class={'ThinButton ' + styles.Button}
            onClick={handleSkipBack}
            type="button"
          >
            <Symbol symbol="mediaSkipBack" />
          </button>
          <button
            class={'ThinButton ' + styles.Button}
            onClick={handleSkipBack}
            type="button"
          >
            <Symbol symbol="mediaRewind" />
          </button>
          <button
            class={'ThinButton ' + styles.Button}
            onClick={handleSkipForward}
            type="button"
          >
            <Symbol symbol="mediaFastForward" />
          </button>
          <button
            class={'ThinButton ' + styles.Button}
            onClick={handleSkipForward}
            type="button"
          >
            <Symbol symbol="mediaSkipForward" />
          </button>
        </div>
      </div>
      <div class={'StatusField ' + styles.Status}>
        <div class={styles.StatusPlayback}>Paused</div>
        <div class={styles.StatusTime}>00:00 / 00:05</div>
      </div>
      <div>{fileData()?.data?.id}</div>
    </>
  );
}
