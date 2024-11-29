import { AppBskyEmbedRecord, AppBskyFeedDefs } from '@atproto/api';
import type { Bluesky_UnknownType } from '../models/Bluesky';

export function getInternalPostURL(post: { uri: string } | undefined) {
  if (!post) {
    return '';
  }

  return `app://Bluesky/Thread?uri=${encodeURIComponent(post.uri)}`;
}

export function getPostURL(
  post: { author: { handle: string }; uri: string } | undefined,
) {
  if (!post) {
    return '';
  }

  const postId = post.uri.substring(post.uri.lastIndexOf('/') + 1);
  const url = `https://bsky.app/profile/${post.author.handle}/post/${postId}`;
  return url;
}

export function getProfileURL(profile: { handle: string } | undefined) {
  if (!profile) {
    return '';
  }

  return `https://bsky.app/profile/${profile.handle}`;
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

export function getViewRecord(record: AppBskyEmbedRecord.View['record']) {
  if (AppBskyEmbedRecord.isViewRecord(record)) {
    return record;
  }
  return;
}

export function getPostView(
  post:
    | AppBskyFeedDefs.PostView
    | AppBskyFeedDefs.NotFoundPost
    | AppBskyFeedDefs.BlockedPost
    | Bluesky_UnknownType
    | undefined,
) {
  if (AppBskyFeedDefs.isPostView(post)) {
    return post;
  }
  return;
}
