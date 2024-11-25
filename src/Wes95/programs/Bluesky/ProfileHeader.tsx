import { Show } from 'solid-js';
import { z } from 'zod';
import type { Bluesky_Actor_ProfileViewDetailedSchema } from '../../models/Bluesky';
import styles from './style.module.css';

export function BlueskyProfileHeader(p: {
  profile: z.infer<typeof Bluesky_Actor_ProfileViewDetailedSchema>;
  openFollowers: () => void;
  openFollows: () => void;
}) {
  const handleFollowClick = () => {
    window.open(`https://bsky.app/profile/${p.profile.handle}`, '_blank');
  };

  return (
    <div
      classList={{
        [styles.ProfileHeader!]: true,
      }}
    >
      <Show when={p.profile.banner}>
        <div
          classList={{
            Well: true,
            [styles.ProfileBanner!]: true,
          }}
          style={{
            'background-image': `url("${encodeURI(p.profile.banner!).replace(/"/g, '%22')}")`,
          }}
        ></div>
      </Show>
      <div
        classList={{
          Horizontal: true,
          [styles.ProfileAvatarButtons!]: true,
        }}
      >
        <div
          classList={{
            Border: true,
            [styles.ProfileAvatar!]: true,
          }}
        >
          <img src={p.profile.avatar} />
        </div>
        <button class="Button" onClick={handleFollowClick}>
          Follow
        </button>
      </div>
      <div class={styles.ProfileInfo!}>
        <div class={styles.ProfileName!}>{p.profile.displayName}</div>
        <div class={styles.ProfileHandle!}>@{p.profile.handle}</div>
        <div class={styles.ProfileNumbers!}>
          <button class={styles.ProfileNumber!} onClick={p.openFollowers}>
            <strong>{p.profile.followersCount}</strong> followers
          </button>
          <button class={styles.ProfileNumber!} onClick={p.openFollows}>
            <strong>{p.profile.followsCount}</strong> following
          </button>
          <div class={styles.ProfileNumber!}>
            <strong>{p.profile.postsCount}</strong> posts
          </div>
        </div>
      </div>
    </div>
  );
}
