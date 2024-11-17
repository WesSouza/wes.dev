import { For, Show, type JSX } from 'solid-js';
import { ProgramManager } from '../lib/ProgramManager';
import { WindowManager } from '../lib/WindowManager';
import { Icon } from './Icon';
import { MenuButton } from './MenuButton';
import { Window } from './Window';
import { EditorDataSchema } from '../programs/Notepad/EditorWindow';

export const Explorer = () => {
  const programManager = ProgramManager.shared;
  const windowManager = WindowManager.shared;
  const state = windowManager.state;

  const addWindow = (id: string) => {
    windowManager.addWindow(
      EditorDataSchema,
      `app://Notepad/Editor?file=File_${id}`,
      {
        icon: 'fileTypeText',
        title: 'File_' + id + ' - Notepad',
        showInTaskbar: true,
        active: true,
      },
    );
  };

  const handleDesktopTaskbarClick: JSX.EventHandler<HTMLElement, MouseEvent> = (
    event,
  ) => {
    if (event.target !== event.currentTarget) {
      return;
    }

    windowManager.setActiveWindow(undefined);
  };

  return (
    <div
      classList={{
        Screen: true,
        '-maximized': windowManager.state.windowMaximized,
      }}
    >
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
        <MenuButton
          appearance="taskbar-start"
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
          onSelect={(id) => addWindow(id)}
        >
          <Icon icon="iconWes" />
          Start
        </MenuButton>
        <div class="VerticalSeparator" />
        <div class="VerticalHandle" />
        <For
          each={state.windows.filter((window) =>
            windowManager.isWindowInTaskbar(window),
          )}
        >
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
              <span class="TaskbarButtonTitle">{window.title}</span>
            </button>
          )}
        </For>
      </footer>
    </div>
  );
};
