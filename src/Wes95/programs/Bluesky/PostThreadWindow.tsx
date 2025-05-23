import type { AppBskyFeedDefs } from '@atproto/api';
import {
  createEffect,
  createMemo,
  createResource,
  For,
  onMount,
  Show,
} from 'solid-js';
import { trpc } from '../../../trpc/client';
import { LoadingAnimation } from '../../components/LoadingAnimation';
import { WindowManager } from '../../lib/WindowManager';
import type { WindowState } from '../../models/WindowState';
import { getThreadView } from '../../utils/bluesky';
import { BlueskyPost } from './Post';
import { BlueskyPostView } from './PostView';
import type { BlueskyPostThreadData } from './registry';
import styles from './style.module.css';

const getPostThread = async (
  uri: string,
): Promise<AppBskyFeedDefs.ThreadViewPost | undefined> => {
  const result = await trpc.wes95_bluesky.getPostThread.query({
    uri,
  });

  if (result.error) {
    const error = new Error(`getPostThread failed`);
    error.cause = result.error;
    throw error;
  }

  return getThreadView(result);
};

export function BlueskyPostThreadWindow(p: {
  data: BlueskyPostThreadData;
  window: WindowState;
}) {
  const [thread] = createResource(p.data.uri, getPostThread);

  const parent = createMemo(() => getThreadView(thread()?.parent));

  const replies = createMemo(
    () =>
      (thread()
        ?.replies?.map(getThreadView)
        .filter(Boolean) as AppBskyFeedDefs.ThreadViewPost[]) ?? [],
  );

  onMount(() => {
    WindowManager.shared.init(p.window.id, {
      icon: 'iconBluesky',
      width: 400,
      height: 600,
    });
  });

  createEffect(() => {
    WindowManager.shared.setWindow(p.window.id, (window) => {
      window.title = `Thread - Bluesky`;
    });
  });

  return (
    <>
      <div
        classList={{
          Field: true,
          [styles.PostList!]: true,
        }}
      >
        <div class="Content Vertical">
          <Show when={parent()}>
            <BlueskyPostView postView={parent()!} />
          </Show>
          <Show when={thread()?.post}>
            <BlueskyPost post={thread()!.post} />
            <hr class={styles.PostSeparator!} />
          </Show>
          <For each={replies()}>
            {(reply) => <BlueskyPostView postView={reply} />}
          </For>
        </div>
      </div>
      <Show when={thread.state === 'pending'}>
        <LoadingAnimation />
      </Show>
    </>
  );
}
