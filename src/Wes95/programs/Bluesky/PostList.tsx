import type { AppBskyFeedDefs } from '@atproto/api';
import { createMemo, createSignal, For } from 'solid-js';
import { BlueskyPost } from './Post';
import styles from './style.module.css';

export function BlueskyPostList(p: {
  filter: 'posts' | 'replies' | 'media';
  onScrolledToEnd: () => void;
  posts: AppBskyFeedDefs.FeedViewPost[];
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
          ('images' in post.post.embed || post.post.embed.media)),
    ),
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
      <div class="Content Vertical" onScroll={handleScroll}>
        <For each={posts()}>{(post) => <BlueskyPost post={post} />}</For>
      </div>
    </div>
  );
}
