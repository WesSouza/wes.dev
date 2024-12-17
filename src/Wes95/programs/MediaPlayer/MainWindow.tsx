import { createEffect, createUniqueId, onMount } from 'solid-js';
import { MenuBar } from '../../components/MenuBar';
import { Symbol } from '../../components/Symbol';
import { WindowManager } from '../../lib/WindowManager';
import type { WindowState } from '../../models/WindowState';
import { FSOpenEventSchema } from '../../system/FileSystem/registry';
import { duration } from '../../utils/dateTime';
import { createWindowURL } from '../../utils/Windows';
import { createMediaPlayer } from './MediaPlayer';
import type { MediaPlayerMainData } from './registry';
import styles from './style.module.css';

const StatusMap = {
  play: 'Playing',
  pause: 'Paused',
  stop: 'Stopped',
  loading: 'Loading...',
  empty: '',
};

export function MediaPlayerMainWindow(p: {
  data: MediaPlayerMainData;
  window: WindowState;
}) {
  const mediaPlayer = createMediaPlayer(p.data.open);

  onMount(() => {
    WindowManager.shared.init(p.window.id, {
      icon: 'iconMplayer',
      width: 370,
      height: 400,
    });
  });

  createEffect(() => {
    WindowManager.shared.setWindow(p.window.id, (window) => {
      window.title = `Media Player`;
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
            `app://MediaPlayer/Main?open=${encodeURIComponent(event.filePath)}`,
          );
        }
        WindowManager.shared.setActiveWindow(p.window);
      },
      FSOpenEventSchema,
    );
  };

  const handleMenuSelect = (id: string) => {
    switch (id) {
      case 'About': {
        WindowManager.shared.addWindow(
          createWindowURL('system://About/Main', {
            appIcon: 'iconMplayer',
            appName: 'Media Player',
          }),
          {
            active: true,
            parentId: p.window.id,
          },
        );
        break;
      }
      case 'Exit': {
        WindowManager.shared.closeWindow(p.window.id);
        break;
      }
      case 'FastForward': {
        mediaPlayer.fastForward();
        break;
      }
      case 'FullScreen': {
        mediaPlayer.fullscreen();
        break;
      }
      case 'Open': {
        openFileDialog();
        break;
      }
      case 'PlayPause': {
        mediaPlayer.togglePlayback();
        break;
      }
      case 'Rewind': {
        mediaPlayer.rewind();
        break;
      }
      case 'SkipBack': {
        mediaPlayer.skipBack();
        break;
      }
      case 'SkipForward': {
        mediaPlayer.skipForward();
        break;
      }
      case 'Stop': {
        mediaPlayer.stop();
        break;
      }
    }
  };

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
      <div
        class={'StatusField ' + styles.Video}
        ref={mediaPlayer.setContainerRef}
      >
        {mediaPlayer.element()}
      </div>
      <div class={styles.Controls}>
        <div class={styles.Timeline}>
          <input
            aria-label="Timeline"
            type="range"
            min="0"
            max={mediaPlayer.state.duration}
            value={mediaPlayer.state.currentTime ?? '0'}
            onChange={(event) =>
              mediaPlayer.seek(Number(event.currentTarget.value))
            }
          />
        </div>
        <div class={styles.Buttons}>
          <button
            aria-label="Play"
            classList={{
              ThinButton: true,
              [styles.Button!]: true,
              '-active': mediaPlayer.state.status === 'play',
            }}
            onClick={() => mediaPlayer.play()}
            type="button"
          >
            <Symbol symbol="mediaPlay" />
          </button>
          <button
            aria-label="Pause"
            classList={{
              ThinButton: true,
              [styles.Button!]: true,
              '-active': mediaPlayer.state.status === 'pause',
            }}
            onClick={() => mediaPlayer.pause()}
            type="button"
          >
            <Symbol symbol="mediaPause" />
          </button>
          <button
            aria-label="Stop"
            class={'ThinButton ' + styles.Button}
            onClick={() => mediaPlayer.stop()}
            type="button"
          >
            <Symbol symbol="mediaStop" />
          </button>
          <div class="VerticalSeparator"></div>
          <button
            aria-label="Skip Backwards"
            class={'ThinButton ' + styles.Button}
            onClick={() => mediaPlayer.skipBack()}
            type="button"
          >
            <Symbol symbol="mediaSkipBack" />
          </button>
          <button
            aria-label="Rewind"
            class={'ThinButton ' + styles.Button}
            onClick={() => mediaPlayer.rewind()}
            type="button"
          >
            <Symbol symbol="mediaRewind" />
          </button>
          <button
            aria-label="Fast Forward"
            class={'ThinButton ' + styles.Button}
            onClick={() => mediaPlayer.fastForward()}
            type="button"
          >
            <Symbol symbol="mediaFastForward" />
          </button>
          <button
            aria-label="Skip Forward"
            class={'ThinButton ' + styles.Button}
            onClick={() => mediaPlayer.skipForward()}
            type="button"
          >
            <Symbol symbol="mediaSkipForward" />
          </button>
        </div>
      </div>
      <div class={'StatusField ' + styles.Status}>
        <div class={styles.StatusPlayback}>
          {StatusMap[mediaPlayer.state.status]}
        </div>
        <div class={styles.StatusTime}>
          {duration(mediaPlayer.state.currentTime ?? 0)} /{' '}
          {duration(mediaPlayer.state.duration ?? 0)}
        </div>
      </div>
    </>
  );
}
