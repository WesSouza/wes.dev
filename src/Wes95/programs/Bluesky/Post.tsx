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
  getViewRecord,
} from '../../utils/bluesky';
import { ago } from '../../utils/dateTime';
import { getURLHostname } from '../../utils/url';
import styles from './style.module.css';
import { WindowManager } from '../../lib/WindowManager';

export function BlueskyPost(p: {
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
        text.push(
          <Link href={segment.link!.uri} target="_blank">
            {segment.text}
          </Link>,
        );
      } else if (segment.isTag()) {
        text.push(
          <Link
            href={`app://Bluesky/PostSearch?q=${encodeURIComponent(segment.text)}`}
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

  const handleEmbedClick = () => {
    const embedRecordData = embedRecord();
    WindowManager.shared.addWindow(getInternalPostURL(embedRecordData), {
      active: true,
    });
  };

  return (
    <>
      <div
        classList={{
          [styles.Post!]: true,
        }}
      >
        <div class={styles.PostAvatar}>
          <Show when={post().author.avatar}>
            <Link
              class={
                styles.PostAvatarImage + ' ' + (p.embed ? styles['-small'] : '')
              }
              href={`app://Bluesky/Profile?did=${encodeURIComponent(post().author.handle)}`}
            >
              <img src={post().author.avatar} alt="User avatar" />
            </Link>
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
                    href={`app://QuickView/Main?open=${encodeURIComponent(image.fullsize)}`}
                  >
                    <img src={image.thumb} alt={image.alt} />
                  </Link>
                )}
              </For>
            </div>
          </Show>
          <Show when={embedVideo()}>
            <Link
              aria-label="Video"
              class={styles.PostContentVideo}
              href={`app://MediaPlayer/Main?open=${encodeURIComponent(embedVideo()!.playlist)}`}
            >
              <Show when={embedVideo()!.thumbnail}>
                <img
                  class={styles.PostContentVideoCover}
                  src={embedVideo()!.thumbnail}
                  alt={embedVideo()!.alt}
                />
                <Icon icon="fileTypeVideo" size="small" />
              </Show>
            </Link>
          </Show>
          <Show when={embedExternal()}>
            <Link
              class={styles.PostContentExternal}
              href={embedExternal()!.uri}
              target="_blank"
            >
              <Show when={embedExternal()!.thumb}>
                <img
                  class={styles.PostContentExternalCover}
                  alt="Thumbnail"
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
            <button
              class={styles.PostContentRecord}
              onClick={handleEmbedClick}
              type="button"
            >
              <BlueskyPost post={embedRecord()!} embed />
            </button>
          </Show>
          <Show when={!p.embed}>
            <div class={styles.PostInteractions}>
              <Link
                alwaysExternal
                class="FlatButton"
                href={post().url}
                target="_blank"
              >
                <Symbol symbol="comment" /> {post().replyCount}
              </Link>
              <Link
                alwaysExternal
                class="FlatButton"
                href={post().url}
                target="_blank"
              >
                <Symbol symbol="repost" /> {post().repostCount}
              </Link>
              <Link
                alwaysExternal
                class="FlatButton"
                href={post().url}
                target="_blank"
              >
                <Symbol symbol="like" /> {post().likeCount}
              </Link>
            </div>
          </Show>
        </div>
      </div>
    </>
  );
}
