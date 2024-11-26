import type { AppBskyFeedDefs } from '@atproto/api';
import { For } from 'solid-js';
import { BlueskyPost } from './Post';
import styles from './style.module.css';

export function BlueskyPostList(p: { posts: AppBskyFeedDefs.FeedViewPost[] }) {
  return (
    <div
      classList={{
        Field: true,
        [styles.PostList!]: true,
      }}
    >
      <div class="Content Vertical MediumSpacing">
        <For each={p.posts}>{(post) => <BlueskyPost post={post} />}</For>
      </div>
    </div>
  );
}
