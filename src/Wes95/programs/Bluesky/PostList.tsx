import type { AppBskyFeedDefs } from '@atproto/api';
import { createMemo, createSignal, For, Show } from 'solid-js';
import type { Bluesky_Actor_ProfileViewDetailed } from '../../models/Bluesky';
import { getRichTextUserDescription } from '../../utils/bluesky';
import { BlueskyPostView } from './PostView';
import styles from './style.module.css';

export function BlueskyPostList(p: {
  contentRef?: HTMLDivElement;
  filter: 'posts' | 'replies' | 'media';
  onScrolledToEnd: () => void;
  posts: AppBskyFeedDefs.FeedViewPost[];
  profile: Bluesky_Actor_ProfileViewDetailed;
}) {
  const [postsLength, setPostsLength] = createSignal();

  const posts = createMemo(() =>
    p.posts.filter(
      (post) =>
        (p.filter === 'posts' && !post.reply) ||
        (p.filter === 'replies' && post.reply) ||
        (p.filter === 'media' &&
          !post.reason &&
          !post.reply &&
          post.post.embed &&
          ('images' in post.post.embed || 'playlist' in post.post.embed)),
    ),
  );

  const description = createMemo(() =>
    getRichTextUserDescription(p.profile.description),
  );

  const handleScroll = (event: Event & { currentTarget: HTMLDivElement }) => {
    if (
      event.currentTarget.scrollTop + event.currentTarget.clientHeight >=
        event.currentTarget.scrollHeight &&
      postsLength() !== posts().length
    ) {
      setPostsLength(posts().length);
      p.onScrolledToEnd?.();
    }
  };

  return (
    <div
      classList={{
        Field: true,
        [styles.PostList!]: true,
      }}
    >
      <div class="Content Vertical" ref={p.contentRef} onScroll={handleScroll}>
        <Show when={p.filter === 'posts'}>
          <div class={styles.PostProfileDescription!}>{description()}</div>
          <hr class={styles.PostSeparator!} />
        </Show>
        <For each={posts()}>
          {(post) => <BlueskyPostView postView={post} />}
        </For>
      </div>
    </div>
  );
}
