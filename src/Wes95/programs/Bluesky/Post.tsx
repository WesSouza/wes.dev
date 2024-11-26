import type { AppBskyFeedDefs } from '@atproto/api';
import { createMemo } from 'solid-js';
import { Bluesky_Feed_Post } from '../../models/Bluesky';
import styles from './style.module.css';

export function BlueskyPost(p: { post: AppBskyFeedDefs.FeedViewPost }) {
  const record = createMemo(() => Bluesky_Feed_Post.parse(p.post.post.record));

  return (
    <div
      classList={{
        [styles.Post!]: true,
      }}
    >
      {record().text}
    </div>
  );
}
