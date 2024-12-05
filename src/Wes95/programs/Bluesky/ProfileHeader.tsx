import { Show } from 'solid-js';
import { Link } from '../../components/Link';
import type { Bluesky_Actor_ProfileViewDetailed } from '../../models/Bluesky';
import { getProfileURL } from '../../utils/bluesky';
import styles from './style.module.css';

export function BlueskyProfileHeader(p: {
  profile: Bluesky_Actor_ProfileViewDetailed;
  openFollowers: () => void;
  openFollows: () => void;
}) {
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
          '-bottom': true,
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
        <Link
          alwaysExternal
          class="Button"
          href={getProfileURL(p.profile)}
          target="_blank"
        >
          Follow
        </Link>
      </div>
      <div class={styles.ProfileInfo!}>
        <div class={styles.ProfileNameHandle!}>
          <div class={styles.ProfileName!}>{p.profile.displayName}</div>
          <div class={styles.ProfileHandle!}>@{p.profile.handle}</div>
        </div>
        <div class={styles.ProfileNumbers!}>
          <Link
            href={`app://Bluesky/UserList?did=${encodeURIComponent(p.profile.handle)}&type=followers`}
          >
            <strong>{p.profile.followersCount}</strong> followers
          </Link>
          <Link
            href={`app://Bluesky/UserList?did=${encodeURIComponent(p.profile.handle)}&type=follows`}
          >
            <strong>{p.profile.followsCount}</strong> following
          </Link>
          <div class={styles.ProfileNumber!}>
            <strong>{p.profile.postsCount}</strong> posts
          </div>
        </div>
      </div>
    </div>
  );
}
