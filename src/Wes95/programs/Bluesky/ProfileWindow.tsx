import type { AppBskyFeedGetAuthorFeed } from '@atproto/api';
import {
  createEffect,
  createMemo,
  createResource,
  createSignal,
  createUniqueId,
  onMount,
  Show,
} from 'solid-js';
import { trpc } from '../../../trpc/client';
import { LoadingAnimation } from '../../components/LoadingAnimation';
import { MenuBar } from '../../components/MenuBar';
import { WindowManager } from '../../lib/WindowManager';
import type { WindowState } from '../../models/WindowState';
import { FSOpenPathEventSchema } from '../../system/FileSystem/registry';
import { getProfileURL } from '../../utils/bluesky';
import { createWindowURL } from '../../utils/Windows';
import { BlueskyPostList } from './PostList';
import { BlueskyProfileHeader } from './ProfileHeader';
import {
  BlueskySearchDialogEventSchema,
  type BlueskyProfileData,
} from './registry';

const WesDID = 'did:plc:4qy26t5ss4zosz2mi3hdzuq3';

let currentActor: string | undefined;

const getAccountPosts = async (
  actor: string,
  info: {
    value: AppBskyFeedGetAuthorFeed.OutputSchema | undefined;
    refetching: string | boolean | undefined;
  },
): Promise<AppBskyFeedGetAuthorFeed.OutputSchema> => {
  const result = await trpc.wes95_bluesky.getAuthorFeed.query({
    actor,
    cursor: typeof info.refetching === 'string' ? info.refetching : undefined,
  });

  const previousFeed = currentActor === actor ? (info.value?.feed ?? []) : [];
  currentActor = actor;

  return {
    feed: previousFeed.concat(result.feed),
    cursor: result.cursor as string | undefined,
  };
};

const getProfile = (actor: string) =>
  trpc.wes95_bluesky.getProfile.query({
    actor,
  });

export function BlueskyProfileWindow(p: {
  data: BlueskyProfileData;
  window: WindowState;
}) {
  let contentElement!: HTMLDivElement;
  const account = createMemo(() => p.data.did ?? WesDID);
  const [view, setView] = createSignal<'posts' | 'replies' | 'media' | 'likes'>(
    'posts',
  );

  const [posts, { refetch: refetchPosts }] = createResource(
    account,
    getAccountPosts,
  );
  const [profile] = createResource(account, getProfile);

  onMount(() => {
    WindowManager.shared.init(p.window.id, {
      icon: 'iconBluesky',
      width: 400,
      height: 600,
    });
  });

  createEffect(() => {
    WindowManager.shared.setWindow(p.window.id, (window) => {
      window.title = `${profile()?.displayName ?? 'Untitled'} - Bluesky`;
    });
  });

  const fetchMore = () => {
    const cursor = posts()?.cursor;
    if (cursor) {
      refetchPosts(cursor);
    }
  };

  const handleOpen = () => {
    const delegateId = createUniqueId();
    WindowManager.shared.addWindow(
      createWindowURL('system://FileSystem/OpenPath', {
        delegateId,
        message:
          'Type the handle or DID of a user, and Bluesky will open it for you.',
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
            `app://Bluesky/Profile?did=${encodeURIComponent(event.filePath)}`,
          );
        }
        WindowManager.shared.setActiveWindow(p.window);
      },
      FSOpenPathEventSchema,
    );
  };

  const handleFind = () => {
    const delegateId = createUniqueId();
    WindowManager.shared.addWindow(
      createWindowURL('app://Bluesky/SearchDialog', {
        delegateId,
      }),
      {
        active: true,
        parentId: p.window.id,
      },
    );

    WindowManager.shared.handleOnce(
      delegateId,
      (event) => {
        if (event.q) {
          WindowManager.shared.addWindow(
            createWindowURL('app://Bluesky/PostSearch', {
              q: event.q,
            }),
            {
              active: true,
            },
          );
        } else {
          WindowManager.shared.setActiveWindow(p.window);
        }
      },
      BlueskySearchDialogEventSchema,
    );
  };

  const handleMenuSelect = (id: string) => {
    switch (id) {
      case 'About': {
        WindowManager.shared.addWindow(
          createWindowURL('system://About/Main', {
            appIcon: 'iconBluesky',
            appName: 'Bluesky',
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

      case 'Find': {
        handleFind();
        break;
      }

      case 'Likes':
      case 'Media':
      case 'Posts':
      case 'Replies': {
        setView(id.toLowerCase() as any);
        break;
      }

      case 'Open': {
        handleOpen();
        break;
      }

      case 'Send': {
        navigator.share({ url: getProfileURL(profile()) });
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
              /* TODO: Implement {
                type: 'item',
                id: 'Likes',
                label: 'Likes',
                checked: view() === 'likes' ? 'radio' : undefined,
              }, */
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
      <Show when={profile()}>
        <BlueskyProfileHeader
          profile={profile()!}
          openFollowers={() => {}}
          openFollows={() => {}}
        />
      </Show>
      <Show when={profile() && posts()?.feed && view() !== 'likes'}>
        <BlueskyPostList
          contentRef={contentElement}
          // @ts-expect-error
          filter={view()}
          onScrolledToEnd={fetchMore}
          posts={posts()!.feed}
          profile={profile()!}
        />
      </Show>
      <Show when={posts.state === 'pending' || profile.state === 'pending'}>
        <LoadingAnimation />
      </Show>
    </>
  );
}
