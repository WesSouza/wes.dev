import type { AppBskyFeedDefs } from '@atproto/api';

export function getPostURL(post: AppBskyFeedDefs.FeedViewPost) {
  const postId = post.post.uri.substring(post.post.uri.lastIndexOf('/') + 1);
  const url = `https://bsky.app/profile/${post.post.author.handle}/post/${postId}`;
  return url;
}
