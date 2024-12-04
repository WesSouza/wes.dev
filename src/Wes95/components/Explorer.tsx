import {
  createEffect,
  createSignal,
  createUniqueId,
  For,
  onCleanup,
  onMount,
  Show,
  type JSX,
} from 'solid-js';
import { createDinger } from '../lib/ding';
import { FileSystemManager } from '../lib/FileSystemManager';
import { ScreenManager } from '../lib/ScreenManager';
import { SessionManager } from '../lib/SessionManager';
import { WindowManager } from '../lib/WindowManager';
import {
  FSOpenEventSchema,
  type FSOpenEvent,
  type FSOpenPathEvent,
} from '../system/FileSystem/registry';
import { isAppURL } from '../utils/url';
import { createWindowURL } from '../utils/Windows';
import { Icon } from './Icon';
import { ItemList } from './ItemList';
import { MenuButton } from './MenuButton';
import { Window } from './Window';

const clockFormatter = Intl.DateTimeFormat(undefined, {
  hour: 'numeric',
  minute: 'numeric',
});

export const Explorer = () => {
  let desktopRef!: HTMLElement;
  const windowManager = WindowManager.shared;
  const screenBreakpoint = ScreenManager.shared.screenBreakpoint;
  const [clock, setClock] = createSignal<string>('');

  const ding = createDinger();

  onMount(() => {
    createEffect(() => {
      SessionManager.shared.restoreFromLocation({
        cleanState: () => {
          windowManager.addWindow(
            `app://WordPad/Main?open=${encodeURIComponent('/C/My Documents/Welcome.doc')}`,
            {
              active: true,
              maximized: screenBreakpoint() === 'small',
            },
          );
        },
      });
    });

    let timer: number;

    function updateClock() {
      const date = new Date();
      setClock(clockFormatter.format(date));

      const seconds = date.getSeconds() * 1000 + date.getMilliseconds();
      timer = window.setTimeout(updateClock, 60000 - seconds);
    }

    updateClock();

    onCleanup(() => {
      window.clearTimeout(timer);
    });
  });

  const run = () => {
    const delegateId = createUniqueId();
    const desktopSize = ScreenManager.shared.desktopSize();
    const scale = ScreenManager.shared.scale();
    const position = desktopSize
      ? {
          x: scale * 16,
          y: desktopSize.height - 270 - scale * 16,
        }
      : undefined;

    windowManager.addWindow(
      createWindowURL('system://FileSystem/OpenPath', {
        browseTypes: ['all'],
        delegateId,
        icon: 'iconRun',
        title: 'Run',
      }),
      {
        active: true,
        position,
      },
    );

    const handleFileSelect = ({ filePath }: FSOpenEvent | FSOpenPathEvent) => {
      if (filePath && isAppURL(filePath)) {
        windowManager.addWindow(filePath, {
          active: true,
        });
      } else {
        const handler = FileSystemManager.shared.getFileHandler(filePath);
        if (handler) {
          windowManager.addWindow(handler, {
            active: true,
          });
        } else {
          windowManager.messageDialog({
            message: 'No program can handle this file type.',
            title: 'Error',
            type: 'error',
            onAction: () => {},
          });
        }
      }
    };

    // TODO: Fix both events firing
    /* windowManager.handleOnce(
      delegateId,
      handleFileSelect,
      FSOpenPathEventSchema,
    ); */

    windowManager.handleOnce(delegateId, handleFileSelect, FSOpenEventSchema);
  };

  const handleStartSelect = (id: string) => {
    if (isAppURL(id)) {
      windowManager.addWindow(id, {
        active: true,
      });
      return;
    }

    switch (id) {
      case 'Run': {
        run();
        break;
      }
    }
  };

  const handleDesktopIconClick = (url: string) => {
    windowManager.addWindow(url, { active: true });
  };

  const handleDesktopTaskbarClick: JSX.EventHandler<HTMLElement, MouseEvent> = (
    event,
  ) => {
    if (event.target !== event.currentTarget) {
      return;
    }

    windowManager.setActiveWindow(undefined);
  };

  const handleDing = () => {
    ding();
  };

  const handleShare = () => {
    const url = new URL(location.href);
    url.search = '?' + SessionManager.shared.encode();
    navigator.clipboard.writeText(url.toString()).catch(console.error);
  };

  return (
    <div
      classList={{
        Screen: true,
        '-maximized': windowManager.isAnyWindowMaximized(),
      }}
    >
      <main
        id="Wes95_Desktop"
        class="Desktop"
        onClick={handleDesktopTaskbarClick}
        ref={desktopRef}
      >
        <ItemList
          appearance="icons-vertical"
          items={[
            {
              icon: 'iconComputer',
              id: `apps://FileExplorer/Main?path=${encodeURIComponent('/My Computer')}`,
              name: 'My Computer',
            },
            {
              icon: 'iconDocumentsFolder',
              id: `apps://FileExplorer/Main?path=${encodeURIComponent('/C/My Documents')}`,
              name: 'My Documents',
            },
            {
              icon: 'iconIexplorer',
              id: `apps://InternetExplorer/Main`,
              name: 'Internet Explorer',
            },
            {
              icon: 'iconTrashEmpty',
              id: `apps://FileExplorer/Main?path=${encodeURIComponent('/Trash')}`,
              name: 'Recycle Bin',
            },
            {
              icon: 'iconBluesky',
              id: `app://Bluesky/Profile`,
              name: 'Bluesky',
            },
            {
              icon: 'fileTypeWordPad',
              id: `apps://WordPad/Main?open=${encodeURIComponent('/C/My Documents/Welcome.doc')}`,
              name: 'Welcome.doc',
            },
          ]}
          onSelect={handleDesktopIconClick}
        />
        <For each={windowManager.state.windows}>
          {(window) => (
            <Window
              active={windowManager.isWindowActive(window.id)}
              window={window}
              windowManager={windowManager}
              zIndex={windowManager.getWindowZIndex(window.id)}
            />
          )}
        </For>
      </main>
      <footer class="Taskbar" onClick={handleDesktopTaskbarClick}>
        <MenuButton
          appearance="taskbar-start"
          direction="block-start"
          items={[
            {
              type: 'item',
              id: 'Programs',
              icon: 'iconProgramsFolder',
              label: 'Programs',
              submenu: [
                {
                  type: 'item',
                  id: 'Accessories',
                  icon: 'iconProgramsFolder',
                  label: 'Accessories',
                  submenu: [
                    {
                      type: 'item',
                      id: 'app://Calculator/Main',
                      icon: 'iconCalculator',
                      label: 'Calculator',
                    },
                    {
                      type: 'item',
                      id: 'app://DiskDefragmenter/Main',
                      icon: 'iconDefrag',
                      label: 'Disk Defragmenter',
                    },
                    {
                      type: 'item',
                      id: 'app://MediaPlayer/Main',
                      icon: 'iconMediaPlayer',
                      label: 'Media Player',
                    },
                    {
                      type: 'item',
                      id: 'app://Notepad/Main',
                      icon: 'iconNotepad',
                      label: 'Notepad',
                    },
                    {
                      type: 'item',
                      id: 'app://Paint/Main',
                      icon: 'iconPaint',
                      label: 'Paint',
                    },
                    {
                      type: 'item',
                      id: 'app://Solitaire/Main',
                      icon: 'iconSolitaire',
                      label: 'Solitaire',
                    },
                    {
                      type: 'item',
                      id: 'app://WordPad/Main',
                      icon: 'iconWordPad',
                      label: 'WordPad',
                    },
                  ],
                },
                {
                  type: 'item',
                  id: 'StartUp',
                  icon: 'iconProgramsFolder',
                  label: 'StartUp',
                  submenu: [
                    {
                      type: 'item',
                      id: 'StartUpEmpty',
                      label: '(Empty)',
                      disabled: true,
                    },
                  ],
                },
                {
                  type: 'item',
                  id: 'app://Bluesky/Profile',
                  icon: 'iconBluesky',
                  label: 'Bluesky',
                },
                {
                  type: 'item',
                  id: 'app://InternetExplorer/Main',
                  icon: 'iconIexplorer',
                  label: 'Internet Explorer',
                },
                {
                  type: 'item',
                  id: 'app://DOS/Main',
                  icon: 'iconDos',
                  label: 'MS-DOS Prompt',
                },
                {
                  type: 'item',
                  id: 'app://WindowsExplorer/Main',
                  icon: 'iconExplorer',
                  label: 'Windows Explorer',
                },
              ],
            },
            {
              type: 'item',
              id: 'Documents',
              icon: 'iconDocumentsFolder',
              label: 'Documents',
            },
            {
              type: 'item',
              id: 'Settings',
              icon: 'iconSettings',
              label: 'Settings',
            },
            {
              type: 'item',
              id: 'Find',
              icon: 'iconFind',
              label: 'Find',
            },
            {
              type: 'item',
              id: 'Help',
              icon: 'iconHelp',
              label: 'Help',
            },
            {
              type: 'item',
              id: 'Run',
              icon: 'iconRun',
              label: 'Run',
            },
            {
              type: 'separator',
            },
            {
              type: 'item',
              id: 'Suspend',
              icon: 'iconSuspend',
              label: 'Suspend',
            },
            {
              type: 'item',
              id: 'Shutdown',
              icon: 'iconShutdown',
              label: 'Shutdown',
            },
          ]}
          onSelect={handleStartSelect}
        >
          <Icon icon="iconWes" />
          <Show when={screenBreakpoint() !== 'small'}>Start</Show>
        </MenuButton>
        <div class="VerticalSeparator" />
        <div class="VerticalHandle" />
        <div class="TaskbarWindows">
          <For
            each={windowManager.state.windows.filter((window) =>
              windowManager.isWindowInTaskbar(window),
            )}
          >
            {(window) => (
              <button
                classList={{
                  TaskbarButton: true,
                  '-active': windowManager.state.activeTaskWindow === window.id,
                  '-small': screenBreakpoint() === 'small',
                  '-down': windowManager.state.activeTaskWindow === window.id,
                }}
                onClick={() => windowManager.setActiveWindow(window)}
              >
                <Show when={window.icon}>
                  <Icon icon={window.icon!} />
                </Show>
                <Show when={screenBreakpoint() !== 'small'}>
                  <span class="TaskbarButtonTitle">{window.title}</span>
                </Show>
              </button>
            )}
          </For>
        </div>
        <div class="TaskbarStatus StatusField">
          <Show when={screenBreakpoint() !== 'small'}>
            <button class="GhostButton" onClick={handleDing} type="button">
              <Icon icon="toolbarSound" />
            </button>
          </Show>
          <button class="GhostButton" onClick={handleShare} type="button">
            <Icon icon="toolbarEject" />
          </button>
          <Show when={screenBreakpoint() !== 'small'}>
            <div class="TaskbarClock">{clock()}</div>
          </Show>
        </div>
      </footer>
    </div>
  );
};
