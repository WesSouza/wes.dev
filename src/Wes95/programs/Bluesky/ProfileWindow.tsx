import type { AppBskyFeedGetAuthorFeed } from '@atproto/api';
import { actions } from 'astro:actions';
import {
  createEffect,
  createResource,
  createSignal,
  createUniqueId,
  onMount,
  Show,
} from 'solid-js';
import { z } from 'zod';
import { MenuBar } from '../../components/MenuBar';
import { WindowManager } from '../../lib/WindowManager';
import type { WindowState } from '../../models/WindowState';
import { FSOpenEventSchema } from '../../system/FileSystem/OpenWindow';
import { createWindowURL } from '../../utils/Windows';
import { BlueskyPostList } from './PostList';
import { BlueskyProfileHeader } from './ProfileHeader';

const WesDID = 'did:plc:4qy26t5ss4zosz2mi3hdzuq3';

export const BlueskyProfileDataSchema = z.object({
  did: z.string().optional(),
});

export type BlueskyProfileData = z.infer<typeof BlueskyProfileDataSchema>;

const getAccountPosts = async (
  actor: string,
  info: {
    value: AppBskyFeedGetAuthorFeed.OutputSchema | undefined;
    refetching: string | boolean | undefined;
  },
): Promise<AppBskyFeedGetAuthorFeed.OutputSchema> => {
  const result = await actions.wes95_bluesky.getAuthorFeed({
    actor,
    cursor: typeof info.refetching === 'string' ? info.refetching : undefined,
  });

  if (result.error) {
    const error = new Error(`getAccountPosts failed`);
    error.cause = result.error;
    throw error;
  }

  return {
    feed: (info.value?.feed ?? []).concat(result.data.feed),
    cursor: result.data.cursor,
  };
};

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
  const [view, setView] = createSignal<'posts' | 'replies' | 'media' | 'likes'>(
    'posts',
  );

  const [posts, { refetch: refetchPosts }] = createResource(
    account,
    getAccountPosts,
  );
  const [profile] = createResource(account, getProfile);

  onMount(() => {
    WindowManager.shared.place(p.window.id, {
      width: 400,
      height: 600,
    });
  });

  createEffect(() => {
    WindowManager.shared.setWindow(p.window.id, (window) => {
      window.title = `${profile()?.data?.displayName ?? 'Untitled'} - Bluesky`;
      window.icon = 'iconBluesky';
    });
  });

  createEffect(() => {
    console.log('feed', posts()?.feed);
  });

  const fetchMore = () => {
    const cursor = posts()?.cursor;
    if (cursor) {
      refetchPosts(cursor);
    }
  };

  const openFileDialog = () => {
    const delegateId = createUniqueId();
    WindowManager.shared.addWindow(
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
    if (id === 'Open') {
      openFileDialog();
    }

    if (
      id === 'Posts' ||
      id === 'Replies' ||
      id === 'Media' ||
      id === 'Likes'
    ) {
      // @ts-expect-error
      setView(id.toLowerCase());
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
                checked: view() === 'posts' ? 'radio' : undefined,
              },
              {
                type: 'item',
                id: 'Replies',
                label: 'Replies',
                checked: view() === 'replies' ? 'radio' : undefined,
              },
              {
                type: 'item',
                id: 'Media',
                label: 'Media',
                checked: view() === 'media' ? 'radio' : undefined,
              },
              {
                type: 'item',
                id: 'Likes',
                label: 'Likes',
                checked: view() === 'likes' ? 'radio' : undefined,
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
                id: 'About',
                label: 'About Bluesky',
              },
            ],
          },
        ]}
        onSelect={handleMenuSelect}
      />
      <Show when={profile()?.data}>
        <BlueskyProfileHeader
          profile={profile()!.data!}
          openFollowers={() => {}}
          openFollows={() => {}}
        />
      </Show>
      <Show when={profile()?.data && posts()?.feed && view() !== 'likes'}>
        <BlueskyPostList
          // @ts-expect-error
          filter={view()}
          onScrolledToEnd={fetchMore}
          posts={posts()!.feed}
          profile={profile()!.data!}
        />
      </Show>
    </>
  );
}
