import type {
  AppBskyEmbedExternal,
  AppBskyEmbedImages,
  AppBskyEmbedVideo,
  AppBskyFeedDefs,
} from '@atproto/api';
import { createMemo, For, Show } from 'solid-js';
import { Bluesky_Feed_Post } from '../../models/Bluesky';
import { ago } from '../../utils/dateTime';
import { getHostname } from '../../utils/url';
import styles from './style.module.css';
import { Icon } from '../../components/Icon';
import { Symbol } from '../../components/Symbol';
import { getPostURL } from '../../utils/bluesky';

export function BlueskyPost(p: { post: AppBskyFeedDefs.FeedViewPost }) {
  const post = createMemo(() => ({ ...p.post.post, url: getPostURL(p.post) }));

  const record = createMemo(() => Bluesky_Feed_Post.parse(post().record));

  const embedImages = createMemo(() =>
    p.post.post.embed && 'images' in p.post.post.embed
      ? (p.post.post.embed.images as AppBskyEmbedImages.ViewImage[])
      : undefined,
  );

  const embedVideo = createMemo(() =>
    p.post.post.embed && 'playlist' in p.post.post.embed
      ? (p.post.post.embed as AppBskyEmbedVideo.View)
      : undefined,
  );

  const embedExternal = createMemo(() =>
    p.post.post.embed && 'external' in p.post.post.embed
      ? (p.post.post.embed.external as AppBskyEmbedExternal.ViewExternal)
      : undefined,
  );

  const handleOpenPost = () => {
    window.open(post().url, '_blank');
  };

  const handleOpenImage = (url: string) => {
    window.open(url, '_blank');
  };

  const handleOpenLink = (url: string) => {
    window.open(url, '_blank');
  };

  const handlePlayVideo = (url: string) => {
    window.open(url, '_blank');
  };

  const handleOpenProfile = (handle: string) => {
    console.log(handle);
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
            <div
              classList={{
                [styles.PostAvatarImage!]: true,
              }}
            >
              <img src={post().author.avatar} />
            </div>
          </Show>
        </div>
        <div
          classList={{
            [styles.PostContent!]: true,
          }}
        >
          <div class={styles.PostContentAuthor}>
            <div class={styles.PostContentAuthorName}>
              <button
                class="LinkButton"
                onClick={() => handleOpenProfile(post().author.handle)}
                type="button"
              >
                {post().author.displayName}
              </button>
            </div>
            <div class={styles.PostContentAuthorHandle}>
              <button
                class="LinkButton"
                onClick={() => handleOpenProfile(post().author.handle)}
                type="button"
              >
                @{post().author.handle}
              </button>
            </div>
            <div class={styles.PostContentAuthorDate}>
              {ago(record().createdAt)}
            </div>
          </div>
          <div class={styles.PostContentBody}>
            <div class={styles.PostContentText}>{record().text}</div>
          </div>
          <Show when={post().embed}>
            <Show when={embedImages()}>
              <div class={styles.PostContentImages}>
                <For each={embedImages()}>
                  {(image) => (
                    <button
                      class={styles.PostContentImage}
                      onClick={() => handleOpenImage(image.fullsize)}
                      type="button"
                    >
                      <img src={image.thumb} />
                    </button>
                  )}
                </For>
              </div>
            </Show>
            <Show when={embedVideo()}>
              <button
                class={styles.PostContentVideo}
                onClick={() => handlePlayVideo(embedVideo()!.playlist)}
              >
                <Show when={embedVideo()!.thumbnail}>
                  <img
                    class={styles.PostContentVideoCover}
                    src={embedVideo()!.thumbnail}
                  />
                  <Icon icon="fileTypeVideo" size="small" />
                </Show>
              </button>
            </Show>
            <Show when={embedExternal()}>
              <button
                class={styles.PostContentExternal}
                onClick={() => handleOpenLink(embedExternal()!.uri)}
                type="button"
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
                    {getHostname(embedExternal()!.uri)}
                  </div>
                </div>
              </button>
            </Show>
          </Show>
          <div class={styles.PostInteractions}>
            <button class="FlatButton" onClick={handleOpenPost} type="button">
              <Symbol symbol="comment" /> {post().replyCount}
            </button>
            <button class="FlatButton" onClick={handleOpenPost} type="button">
              <Symbol symbol="repost" /> {post().repostCount}
            </button>
            <button class="FlatButton" onClick={handleOpenPost} type="button">
              <Symbol symbol="like" /> {post().likeCount}
            </button>
          </div>
        </div>
      </div>
      <hr class={styles.PostSeparator!} />
    </>
  );
}
