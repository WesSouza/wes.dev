import { AppBskyFeedDefs } from '@atproto/api';
import { createMemo, Show } from 'solid-js';
import { Symbol } from '../../components/Symbol';
import { getPostURL, getPostView, getRepost } from '../../utils/bluesky';
import { BlueskyPost } from './Post';
import styles from './style.module.css';

export function BlueskyPostView(p: {
  postView: AppBskyFeedDefs.FeedViewPost | AppBskyFeedDefs.ThreadViewPost;
}) {
  const post = createMemo(() => ({
    ...p.postView.post,
    url: getPostURL(p.postView.post),
  }));

  const feedView = createMemo(() =>
    'reply' in p.postView || 'reason' in p.postView ? p.postView : undefined,
  );

  const replyRoot = createMemo(() => getPostView(feedView()?.reply?.root));
  const replyParent = createMemo(() => getPostView(feedView()?.reply?.parent));
  const repost = createMemo(() => {
    const value = feedView();
    if (!value) {
      return;
    }
    return getRepost(value);
  });

  return (
    <>
      <Show when={repost()}>
        <div class={styles.PostRepost}>
          <Symbol symbol="repost" /> Reposted by {repost()?.by.displayName}
        </div>
      </Show>
      <Show when={replyRoot() && replyRoot()?.cid !== replyParent()?.cid}>
        <BlueskyPost post={replyRoot()!} replyLine />
      </Show>
      <Show when={replyParent()}>
        <BlueskyPost post={replyParent()!} replyLine />
      </Show>
      <BlueskyPost post={post()} />
      <hr class={styles.PostSeparator!} />
    </>
  );
}
