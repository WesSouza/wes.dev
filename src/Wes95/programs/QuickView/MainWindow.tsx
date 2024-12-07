import { createMemo, createUniqueId, onMount } from 'solid-js';
import { MenuBar } from '../../components/MenuBar';
import { WindowManager } from '../../lib/WindowManager';
import type { WindowState } from '../../models/WindowState';
import { FSOpenEventSchema } from '../../system/FileSystem/registry';
import { getRealPublicURL } from '../../utils/url';
import { createWindowURL } from '../../utils/Windows';
import type { QuickViewMainData } from './registry';

export function QuickViewMainWindow(p: {
  data: QuickViewMainData;
  window: WindowState;
}) {
  let contentElement!: HTMLTextAreaElement;

  const url = createMemo(() => {
    return getRealPublicURL(p.data.open)?.toString();
  });

  onMount(() => {
    WindowManager.shared.init(p.window.id, {
      icon: 'iconQuickView',
      title: 'Quick View',
    });
  });

  const openFileDialog = () => {
    const delegateId = createUniqueId();
    WindowManager.shared.addWindow(
      createWindowURL('system://FileSystem/Open', {
        delegateId,
        fileTypes: ['all'],
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
            `app://QuickView/Main?open=${encodeURIComponent(event.filePath)}`,
          );
          contentElement.scrollTo(0, 0);
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
            id: 'Help',
            label: 'Help',
            submenu: [
              {
                type: 'item',
                id: 'About',
                label: 'About Quick View',
              },
            ],
          },
        ]}
        onSelect={handleMenuSelect}
      />
      <div
        classList={{
          Field: true,
        }}
      >
        <div class="Content Vertical">
          <img src={url()} style={{ 'align-self': 'flex-start' }} />
        </div>
      </div>
    </>
  );
}
