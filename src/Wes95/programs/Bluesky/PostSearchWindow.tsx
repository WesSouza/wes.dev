import type { AppBskyFeedDefs, AppBskyFeedSearchPosts } from '@atproto/api';
import {
  createEffect,
  createResource,
  createSignal,
  For,
  onMount,
  Show,
} from 'solid-js';
import { WindowManager } from '../../lib/WindowManager';
import type { WindowState } from '../../models/WindowState';
import { BlueskyPost } from './Post';
import type { BlueskyPostSearchData } from './registry';
import styles from './style.module.css';
import { LoadingAnimation } from '../../components/LoadingAnimation';
import { trpc } from '../../../trpc/client';

let currentQuery: string | undefined;

const getSearchPosts = async (
  q: string,
  info: {
    value: AppBskyFeedSearchPosts.OutputSchema | undefined;
    refetching: string | boolean | undefined;
  },
): Promise<AppBskyFeedSearchPosts.OutputSchema> => {
  const result = await trpc.wes95_bluesky.searchPosts.query({
    q,
    limit: 100,
    cursor: typeof info.refetching === 'string' ? info.refetching : undefined,
  });

  if (result.error) {
    const error = new Error(`getSearchPosts failed`);
    error.cause = result.error;
    throw error;
  }

  const previousPosts = currentQuery === q ? (info.value?.posts ?? []) : [];
  currentQuery = q;

  return {
    cursor: result.cursor as string | undefined,
    posts: previousPosts.concat(
      (result.posts as AppBskyFeedDefs.PostView[]) ?? [],
    ),
  };
};

export function BlueskyPostSearchWindow(p: {
  data: BlueskyPostSearchData;
  window: WindowState;
}) {
  let contentElement!: HTMLDivElement;
  const [postsCount, setPostsCount] = createSignal();
  const [posts, { refetch }] = createResource(p.data.q, getSearchPosts);

  onMount(() => {
    WindowManager.shared.init(p.window.id, {
      icon: 'iconBluesky',
      width: 400,
      height: 600,
    });
  });

  createEffect(() => {
    WindowManager.shared.setWindow(p.window.id, (window) => {
      window.title = `Search: ${p.data.q} - Bluesky`;
    });
  });

  const handleScroll = (event: Event & { currentTarget: HTMLDivElement }) => {
    // TODO: Searching with cursor is broken on Bluesky?
    // const cursor = posts()?.cursor;
    const cursor = false;
    if (
      cursor &&
      event.currentTarget.scrollTop + event.currentTarget.clientHeight >=
        event.currentTarget.scrollHeight &&
      postsCount() !== posts()?.posts.length
    ) {
      setPostsCount(posts()?.posts.length);
      refetch(cursor);
    }
  };

  return (
    <>
      <div
        classList={{
          Field: true,
          [styles.PostList!]: true,
        }}
      >
        <div
          class="Content Vertical"
          onScroll={handleScroll}
          ref={contentElement}
        >
          <For each={posts()?.posts}>
            {(post) => (
              <>
                <BlueskyPost post={post} />
                <hr class={styles.PostSeparator!} />
              </>
            )}
          </For>
        </div>
      </div>{' '}
      <Show when={posts.state === 'pending'}>
        <LoadingAnimation />
      </Show>
    </>
  );
}
