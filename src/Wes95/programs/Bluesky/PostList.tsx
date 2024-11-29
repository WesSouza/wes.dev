import type { AppBskyFeedDefs } from '@atproto/api';
import anchorme from 'anchorme';
import { createMemo, createSignal, For } from 'solid-js';
import type { Bluesky_Actor_ProfileViewDetailed } from '../../models/Bluesky';
import { BlueskyPost } from './Post';
import styles from './style.module.css';
import { Link } from '../../components/Link';

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

  const description = createMemo(() => {
    const description = p.profile.description;
    if (!description) {
      return [];
    }
    const text = [];
    const links = anchorme.list(description);
    let start = 0;
    for (const link of links) {
      const precedingText = description.substring(start, link.start);
      start = link.end;
      if (precedingText) {
        text.push(precedingText);
      }
      if (link.isURL) {
        text.push(
          <Link
            href={(!link.confirmedByProtocol ? 'https://' : '') + link.string}
          >
            {link.string}
          </Link>,
        );
      }
    }

    const remainingText = description.substring(start);
    return [...text, remainingText];
  });

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
        <div class={styles.PostProfileDescription!}>{description()}</div>
        <hr class={styles.PostSeparator!} />
        <For each={posts()}>{(post) => <BlueskyPost post={post} />}</For>
      </div>
    </div>
  );
}
