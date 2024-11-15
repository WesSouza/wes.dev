import { createEffect, createSignal, For, Show, type JSX } from 'solid-js';
import { WindowManager } from '../lib/WindowManager';
import { Window } from './Window';
import { Icon } from './Icon';
import type { Anchor } from '../models/Geometry';
import { Menu } from './Menu';

export const Explorer = () => {
  let startElement!: HTMLButtonElement;
  const windowManager = WindowManager.shared;
  const state = windowManager.state;
  const [startAnchor, setStartAnchor] = createSignal<Anchor>();
  const [startMenuOpen, setStartMenuOpen] = createSignal(false);

  const addWindow = (id: string) => {
    windowManager.addWindow({
      icon: 'iconWes',
      title: 'Window ' + id,
      url: `file://Window?id=${id}`,
      showInTaskbar: true,
      active: true,
    });
    closeMenu();
  };

  const handleDesktopTaskbarClick: JSX.EventHandler<HTMLElement, MouseEvent> = (
    event,
  ) => {
    if (event.target !== event.currentTarget) {
      return;
    }

    windowManager.setActiveWindow(undefined);
  };

  const toggleMenu = () => {
    setStartMenuOpen((open) => !open);
  };

  const closeMenu = () => {
    setStartMenuOpen(false);
  };

  createEffect(() => {
    if (!startElement) {
      setStartAnchor(undefined);
      return;
    }

    const rect = startElement.getBoundingClientRect();

    setStartAnchor({
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
      direction: 'block-start',
    });
  });

  return (
    <div class="Screen">
      <main class="Desktop" onClick={handleDesktopTaskbarClick}>
        <For each={state.windows}>
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
        <button
          type="button"
          class="TaskbarButton"
          onClick={toggleMenu}
          ref={startElement}
        >
          <Icon icon="iconWes" />
          Start
        </button>
        <div class="VerticalSeparator" />
        <div class="VerticalHandle" />
        <For each={state.windows.filter((window) => window.showInTaskbar)}>
          {(window) => (
            <button
              classList={{
                TaskbarButton: true,
                '-active': state.activeTaskWindow === window.id,
                '-down': state.activeTaskWindow === window.id,
              }}
              onClick={() => windowManager.setActiveWindow(window)}
            >
              <Show when={window.icon}>
                <Icon icon={window.icon!} />
              </Show>
              {window.title}
            </button>
          )}
        </For>
      </footer>
      <Show when={startMenuOpen() && startAnchor()}>
        <Menu
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
                      id: 'Four',
                      icon: 'iconProgramsFolder',
                      label: 'Four',
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
                  id: 'InternetExplorer',
                  icon: 'iconIexplorer',
                  label: 'Internet Explorer',
                },
                {
                  type: 'item',
                  id: 'DOS',
                  icon: 'iconDos',
                  label: 'MS-DOS Prompt',
                },
                {
                  type: 'item',
                  id: 'WindowsExplorer',
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
          iconSizes="large"
          anchor={startAnchor()!}
          onClose={closeMenu}
          onSelect={(id) => addWindow(id)}
        />
      </Show>
    </div>
  );
};
