import { Show } from 'solid-js';
import type { Bluesky_Actor_ProfileViewDetailed } from '../../models/Bluesky';
import styles from './style.module.css';

export function BlueskyProfileHeader(p: {
  profile: Bluesky_Actor_ProfileViewDetailed;
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
          '-end': true,
          [styles.ProfileAvatarButtons!]: true,
          [styles['-insideBanner']!]: Boolean(p.profile.banner),
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
        <div class={styles.ProfileNameHandle!}>
          <div class={styles.ProfileName!}>{p.profile.displayName}</div>
          <div class={styles.ProfileHandle!}>@{p.profile.handle}</div>
        </div>
        <div class={styles.ProfileNumbers!}>
          <button
            classList={{ LinkButton: true, [styles.ProfileNumber!]: true }}
            onClick={p.openFollowers}
          >
            <strong>{p.profile.followersCount}</strong> followers
          </button>
          <button
            classList={{ LinkButton: true, [styles.ProfileNumber!]: true }}
            onClick={p.openFollows}
          >
            <strong>{p.profile.followsCount}</strong> following
          </button>
          <div class={styles.ProfileNumber!}>
            <strong>{p.profile.postsCount}</strong> posts
          </div>
        </div>
      </div>
      <div class={styles.ProfileDescription!}>{p.profile.description}</div>
    </div>
  );
}
