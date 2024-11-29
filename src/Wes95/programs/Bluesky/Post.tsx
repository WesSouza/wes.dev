import {
  AppBskyEmbedRecord,
  AppBskyFeedDefs,
  RichText,
  type AppBskyEmbedExternal,
  type AppBskyEmbedImages,
  type AppBskyEmbedVideo,
} from '@atproto/api';
import { createMemo, For, Show, type JSX } from 'solid-js';
import { Icon } from '../../components/Icon';
import { Link } from '../../components/Link';
import { Symbol } from '../../components/Symbol';
import { Bluesky_Feed_Post } from '../../models/Bluesky';
import {
  getInternalPostURL,
  getPostURL,
  getPostView,
  getRepost,
  getViewRecord,
} from '../../utils/bluesky';
import { ago } from '../../utils/dateTime';
import { getURLHostname } from '../../utils/url';
import styles from './style.module.css';

export function BlueskyPost(p: { post: AppBskyFeedDefs.FeedViewPost }) {
  const post = createMemo(() => ({
    ...p.post.post,
    url: getPostURL(p.post.post),
  }));
  const replyRoot = createMemo(() => getPostView(p.post.reply?.root));
  const replyParent = createMemo(() => getPostView(p.post.reply?.parent));
  const repost = createMemo(() => getRepost(p.post));

  return (
    <>
      <Show when={repost()}>
        <div class={styles.PostRepost}>
          <Symbol symbol="repost" /> Reposted by {repost()?.by.displayName}
        </div>
      </Show>
      <Show when={replyRoot() && replyRoot()?.cid !== replyParent()?.cid}>
        <BlueskyPostItem post={replyRoot()!} replyLine />
      </Show>
      <Show when={replyParent()}>
        <BlueskyPostItem post={replyParent()!} replyLine />
      </Show>
      <BlueskyPostItem post={post()} />
      <hr class={styles.PostSeparator!} />
    </>
  );
}

function BlueskyPostItem(p: {
  embed?: boolean;
  post: AppBskyFeedDefs.PostView | AppBskyEmbedRecord.ViewRecord;
  replyLine?: boolean;
}) {
  const post = createMemo(() => ({ ...p.post, url: getPostURL(p.post) }));
  const record = createMemo(() => {
    const postData = post();
    return Bluesky_Feed_Post.parse(
      'record' in postData ? postData.record : postData.value,
    );
  });

  const richText = createMemo(() => {
    const rt = new RichText({
      text: record().text,
      facets: record().facets,
    });

    const text: JSX.Element[] = [];
    for (const segment of rt.segments()) {
      if (segment.isMention()) {
        text.push(
          <Link
            href={`app://Bluesky/Profile?did=${encodeURIComponent(segment.mention!.did)}`}
          >
            {segment.text}
          </Link>,
        );
      } else if (segment.isLink()) {
        text.push(<Link href={segment.link!.uri}>{segment.text}</Link>);
      } else if (segment.isTag()) {
        text.push(
          <Link
            href={`app://Bluesky/Hashtag?tag=${encodeURIComponent(segment.text.replace(/^#/, ''))}`}
          >
            {segment.text}
          </Link>,
        );
      } else {
        text.push(segment.text);
      }
    }

    return text;
  });

  const embedImages = createMemo(() =>
    p.post.embed && typeof p.post.embed === 'object' && 'images' in p.post.embed
      ? (p.post.embed.images as AppBskyEmbedImages.ViewImage[])
      : undefined,
  );

  const embedVideo = createMemo(() =>
    p.post.embed &&
    typeof p.post.embed === 'object' &&
    'playlist' in p.post.embed
      ? (p.post.embed as AppBskyEmbedVideo.View)
      : undefined,
  );

  const embedExternal = createMemo(() =>
    p.post.embed &&
    typeof p.post.embed === 'object' &&
    'external' in p.post.embed
      ? (p.post.embed.external as AppBskyEmbedExternal.ViewExternal)
      : undefined,
  );

  const embedRecord = createMemo(() =>
    p.post.embed && typeof p.post.embed === 'object' && 'record' in p.post.embed
      ? getViewRecord(p.post.embed.record as any)
      : undefined,
  );

  const embedRecordLink = createMemo(() => {
    const embedRecordData = embedRecord();
    return getInternalPostURL(embedRecordData);
  });

  return (
    <>
      <div
        classList={{
          [styles.Post!]: true,
        }}
      >
        <div class={styles.PostAvatar}>
          <Show when={post().author.avatar}>
            <div
              classList={{
                [styles.PostAvatarImage!]: true,
                [styles['-small']!]: p.embed,
              }}
            >
              <img src={post().author.avatar} />
            </div>
          </Show>
          <Show when={p.replyLine}>
            <div class={styles.PostReplyLine}></div>
          </Show>
        </div>
        <div
          classList={{
            [styles.PostContent!]: true,
          }}
        >
          <div class={styles.PostContentAuthor}>
            <div class={styles.PostContentAuthorName}>
              <Show when={!p.embed} fallback={post().author.displayName}>
                <Link
                  href={`app://Bluesky/Profile?did=${encodeURIComponent(post().author.handle)}`}
                >
                  {post().author.displayName}
                </Link>
              </Show>
            </div>
            <div class={styles.PostContentAuthorHandle}>
              <Show when={!p.embed} fallback={`@${post().author.handle}`}>
                <Link
                  href={`app://Bluesky/Profile?did=${encodeURIComponent(post().author.handle)}`}
                >
                  @{post().author.handle}
                </Link>
              </Show>
            </div>
            <div class={styles.PostContentAuthorDate}>
              {ago(record().createdAt)}
            </div>
          </div>
          <div class={styles.PostContentBody}>
            <div class={styles.PostContentText}>{richText()}</div>
          </div>
          <Show when={embedImages()}>
            <div class={styles.PostContentImages}>
              <For each={embedImages()}>
                {(image) => (
                  <Link
                    class={styles.PostContentImage}
                    href={`app://QuickView/Main?url=${encodeURIComponent(image.fullsize)}`}
                  >
                    <img src={image.thumb} />
                  </Link>
                )}
              </For>
            </div>
          </Show>
          <Show when={embedVideo()}>
            <Link
              class={styles.PostContentVideo}
              href={`app://MediaPlayer/Main?url=${encodeURIComponent(embedVideo()!.playlist)}`}
            >
              <Show when={embedVideo()!.thumbnail}>
                <img
                  class={styles.PostContentVideoCover}
                  src={embedVideo()!.thumbnail}
                />
                <Icon icon="fileTypeVideo" size="small" />
              </Show>
            </Link>
          </Show>
          <Show when={embedExternal()}>
            <Link
              class={styles.PostContentExternal}
              href={embedExternal()!.uri}
            >
              <Show when={embedExternal()!.thumb}>
                <img
                  class={styles.PostContentExternalCover}
                  src={embedExternal()!.thumb!}
                />
              </Show>
              <div class={styles.PostContentExternalInfo}>
                <div class={styles.PostContentExternalTitle}>
                  {embedExternal()!.title}
                </div>
                <div class={styles.PostContentExternalDescription}>
                  {embedExternal()!.description}
                </div>
                <div class={styles.PostContentExternalHostname}>
                  {getURLHostname(embedExternal()!.uri)}
                </div>
              </div>
            </Link>
          </Show>
          <Show when={embedRecord()}>
            <Link class={styles.PostContentRecord} href={embedRecordLink()}>
              <BlueskyPostItem post={embedRecord()!} embed />
            </Link>
          </Show>
          <Show when={!p.embed}>
            <div class={styles.PostInteractions}>
              <Link class="FlatButton" href={post().url} target="_blank">
                <Symbol symbol="comment" /> {post().replyCount}
              </Link>
              <Link class="FlatButton" href={post().url} target="_blank">
                <Symbol symbol="repost" /> {post().repostCount}
              </Link>
              <Link class="FlatButton" href={post().url} target="_blank">
                <Symbol symbol="like" /> {post().likeCount}
              </Link>
            </div>
          </Show>
        </div>
      </div>
    </>
  );
}
