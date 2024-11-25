import { actions } from 'astro:actions';
import {
  createEffect,
  createResource,
  createSignal,
  createUniqueId,
} from 'solid-js';
import { z } from 'zod';
import { MenuBar } from '../../components/MenuBar';
import { WindowManager } from '../../lib/WindowManager';
import type { WindowState } from '../../models/WindowState';
import {
  FSOpenDataSchema,
  FSOpenEventSchema,
} from '../../system/FileSystem/OpenWindow';
import { createWindowURL } from '../../utils/Windows';

const WesDID = 'did:plc:4qy26t5ss4zosz2mi3hdzuq3';

export const BlueskyProfileDataSchema = z.object({
  did: z.string().optional(),
});

export type BlueskyProfileData = z.infer<typeof BlueskyProfileDataSchema>;

const getAccountPosts = (actor: string) =>
  actions.wes95_bluesky.getAuthorFeed({
    actor,
  });

const getProfile = (actor: string) =>
  actions.wes95_bluesky.getProfile({
    actor,
  });

export function BlueskyProfileWindow(p: {
  data: BlueskyProfileData;
  window: WindowState;
}) {
  let contentElement!: HTMLTextAreaElement;
  const [account, setAccount] = createSignal(p.data.did ?? WesDID);

  const [posts] = createResource(account, getAccountPosts);
  const [profile] = createResource(account, getProfile);

  createEffect(() => {
    WindowManager.shared.setWindow(p.window.id, (window) => {
      window.title = `${profile()?.data?.displayName ?? 'Untitled'} - Bluesky`;
      window.icon = 'iconBluesky';
    });
  });

  createEffect(() => {
    console.log('feed', posts()?.data?.feed);
    console.log('profile', profile()?.data);
  });

  const openFileDialog = () => {
    const delegateId = createUniqueId();
    WindowManager.shared.addWindow(
      FSOpenDataSchema,
      createWindowURL('system://FileSystem/Open', {
        delegateId,
        fileTypes: ['document'],
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
          setAccount(event.filePath);
          contentElement.scrollTo(0, 0);
        }
        WindowManager.shared.setActiveWindow(p.window);
      },
      FSOpenEventSchema,
    );
  };

  const handleMenuSelect = (id: string) => {
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
                id: 'Send',
                label: 'Send...',
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
                id: 'Posts',
                label: 'Posts',
              },
              {
                type: 'item',
                id: 'Replies',
                label: 'Replies',
              },
              {
                type: 'item',
                id: 'Media',
                label: 'Media',
              },
              {
                type: 'item',
                id: 'Likes',
                label: 'Likes',
              },
            ],
          },
          {
            type: 'item',
            id: 'Search',
            label: 'Search',
            submenu: [
              {
                type: 'item',
                id: 'Find',
                label: 'Find...',
              },
              {
                type: 'item',
                id: 'FindNext',
                label: 'Find Next',
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
                id: 'HelpTopics',
                label: 'Help Topics',
              },
              {
                type: 'separator',
              },
              {
                type: 'item',
                id: 'About',
                label: 'About Bluesky',
              },
            ],
          },
        ]}
        onSelect={handleMenuSelect}
      />
      <div>
        <button class="Button" type="button" onClick={openFileDialog}>
          Open
        </button>
      </div>
      {posts()?.data?.feed?.length} posts
    </>
  );
}
