import {
  createEffect,
  createResource,
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
import { FocusProvider } from '../lib/FocusContext';
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

const getFirstBlogFiles = async () => {
  const blogFiles = (
    await FileSystemManager.shared.getFiles('/C/My Documents/Blog')
  ).toSorted(
    (left, right) => (right.date?.getTime() ?? 0) - (left.date?.getTime() ?? 0),
  );
  return blogFiles.slice(0, 5);
};

export const Explorer = () => {
  let desktopRef!: HTMLElement;
  const windowManager = WindowManager.shared;
  const screenBreakpoint = ScreenManager.shared.screenBreakpoint;
  const [clock, setClock] = createSignal<string>('');

  const ding = createDinger();

  const [firstBlogFiles] = createResource(getFirstBlogFiles);

  onMount(() => {
    createEffect(() => {
      SessionManager.shared.restoreFromLocation({
        cleanState: () => {
          windowManager.addWindow(
            `app://WordPad/Main?open=${encodeURIComponent('/C/My Documents/Welcome.doc')}`,
            {
              active: true,
              position: {
                x: 160,
                y: 30,
              },
              size: {
                width: 480,
                height: 520,
              },
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
    <FocusProvider>
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
                    id: 'app://FileExplorer/Main',
                    icon: 'iconExplorer',
                    label: 'File Explorer',
                  },
                ],
              },
              {
                type: 'item',
                id: 'Documents',
                icon: 'iconDocumentsFolder',
                label: 'Documents',
                submenu: [
                  {
                    type: 'item',
                    id: createWindowURL('app://FileExplorer/Main', {
                      path: '/C/My Documents/Blog',
                    }),
                    icon: 'iconDocumentsFolder',
                    label: 'Blog',
                  },
                  ...(firstBlogFiles()
                    ? [
                        { type: 'separator' as const },
                        ...firstBlogFiles()!.map((file) => ({
                          type: 'item' as const,
                          id: createWindowURL('app://FileExplorer/Main', {
                            path: file.path,
                          }),
                          icon: 'fileTypeWordPad',
                          label: file.name,
                        })),
                      ]
                    : []),
                ],
              },
              {
                type: 'item',
                id: 'app://Find/Main',
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
                id: 'Shutdown',
                icon: 'iconShutdown',
                label: 'Shutdown',
              },
            ]}
            onSelect={handleStartSelect}
            verticalBar={
              <div class="MenuWes95">
                <div class="Wes95">
                  <span class="Wes">Wes</span>95
                </div>
              </div>
            }
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
                    '-active':
                      windowManager.state.activeTaskWindow === window.id,
                    '-small': screenBreakpoint() === 'small',
                    '-down': windowManager.state.activeTaskWindow === window.id,
                  }}
                  data-window-taskbar-button={window.id}
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
        <Show when={windowManager.state.titleAnimation}>
          <div
            class="WindowTitleAnimation"
            style={{
              '--wes95-title-from-x': `${windowManager.state.titleAnimation!.from.x}px`,
              '--wes95-title-from-y': `${windowManager.state.titleAnimation!.from.y}px`,
              '--wes95-title-from-width': `${windowManager.state.titleAnimation!.from.width}px`,
              '--wes95-title-from-height': `${windowManager.state.titleAnimation!.from.height}px`,
              '--wes95-title-to-x': `${windowManager.state.titleAnimation!.to.x}px`,
              '--wes95-title-to-y': `${windowManager.state.titleAnimation!.to.y}px`,
              '--wes95-title-to-width': `${windowManager.state.titleAnimation!.to.width}px`,
              '--wes95-title-to-height': `${windowManager.state.titleAnimation!.to.height}px`,
            }}
          >
            <Show when={windowManager.state.titleAnimation!.icon}>
              <div class="WindowTitleIcon">
                <Icon icon={windowManager.state.titleAnimation!.icon!} />
              </div>
            </Show>
            <span class="WindowTitleText">
              {windowManager.state.titleAnimation!.title}
            </span>
          </div>
        </Show>
      </div>
    </FocusProvider>
  );
};
