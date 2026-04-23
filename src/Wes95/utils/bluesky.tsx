import { AppBskyEmbedRecord, AppBskyFeedDefs } from '@atproto/api';
import anchorme from 'anchorme';
import { Link } from '../components/Link';

export function getInternalPostURL(post: { uri: string } | undefined) {
  if (!post) {
    return '';
  }

  return `app://Bluesky/PostThread?uri=${encodeURIComponent(post.uri)}`;
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

export function getPostView(post: unknown) {
  if (AppBskyFeedDefs.isPostView(post)) {
    return post as AppBskyFeedDefs.PostView;
  }
  return;
}

export function getThreadView(thread: unknown) {
  if (AppBskyFeedDefs.isThreadViewPost(thread)) {
    return thread as AppBskyFeedDefs.ThreadViewPost;
  }
  return;
}

export function getRichTextUserDescription(description: string | undefined) {
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
          target="_blank"
        >
          {link.string}
        </Link>,
      );
    }
  }

  const remainingText = description.substring(start);
  return [...text, remainingText];
}
