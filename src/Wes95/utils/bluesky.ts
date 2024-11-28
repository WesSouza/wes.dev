import { AppBskyFeedDefs } from '@atproto/api';

export function getPostURL(post: AppBskyFeedDefs.FeedViewPost) {
  const postId = post.post.uri.substring(post.post.uri.lastIndexOf('/') + 1);
  const url = `https://bsky.app/profile/${post.post.author.handle}/post/${postId}`;
  return url;
}

export function getPin(post: AppBskyFeedDefs.FeedViewPost) {
  if (AppBskyFeedDefs.isReasonPin(post.reason)) {
    return post.reason;
  }
  return;
}

export function getRepost(post: AppBskyFeedDefs.FeedViewPost) {
  if (AppBskyFeedDefs.isReasonRepost(post.reason)) {
    return post.reason;
  }
  return;
}
