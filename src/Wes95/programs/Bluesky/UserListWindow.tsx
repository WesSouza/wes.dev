import {
  createEffect,
  createResource,
  createSignal,
  createUniqueId,
  For,
  onMount,
  Show,
} from 'solid-js';
import { trpc } from '../../../trpc/client';
import { LoadingAnimation } from '../../components/LoadingAnimation';
import { MenuBar } from '../../components/MenuBar';
import { WindowManager } from '../../lib/WindowManager';
import type { Bluesky_UserList } from '../../models/Bluesky';
import type { WindowState } from '../../models/WindowState';
import { FSOpenPathEventSchema } from '../../system/FileSystem/registry';
import { createWindowURL } from '../../utils/Windows';
import type { BlueskyUserListData } from './registry';
import styles from './style.module.css';

type Type = 'follows' | 'followers';

const getUserList = async (
  options: { did: string; type: Type },
  info: {
    value: (Bluesky_UserList & { type: Type }) | undefined;
    refetching: string | boolean | undefined;
  },
): Promise<Bluesky_UserList & { type: Type }> => {
  const result = await trpc.wes95_bluesky.getUserList.query({
    actor: options.did,
    type: options.type,
    cursor: typeof info.refetching === 'string' ? info.refetching : undefined,
  });

  return {
    cursor: result.cursor,
    users: (
      (info.value?.type === options.type ? info.value?.users : []) ?? []
    ).concat(result.users),
    subject: result.subject,
    type: options.type,
  };
};

export function BlueskyUserListWindow(p: {
  data: BlueskyUserListData;
  window: WindowState;
}) {
  let contentElement!: HTMLDivElement;
  const [options, setOptions] = createSignal({
    did: p.data.did,
    type: p.data.type,
  });
  const [usersCount, setUsersCount] = createSignal();

  const [users, { refetch: refetchUsers }] = createResource(
    options,
    getUserList,
  );

  onMount(() => {
    WindowManager.shared.init(p.window.id, {
      icon: 'iconBluesky',
      width: 400,
      height: 600,
    });
  });

  createEffect(() => {
    WindowManager.shared.setWindow(p.window.id, (window) => {
      window.title = `${users()?.subject.displayName ?? ''} - ${options().type === 'followers' ? 'Followers' : 'Following'} - Bluesky`;
    });
  });

  const handleUserClick = (handle: string) => {
    WindowManager.shared.addWindow(
      `app://Bluesky/Profile?did=${encodeURIComponent(handle)}`,
      { active: true },
    );
  };

  const handleScroll = (event: Event & { currentTarget: HTMLDivElement }) => {
    const cursor = users()?.cursor;
    if (
      cursor &&
      event.currentTarget.scrollTop + event.currentTarget.clientHeight >=
        event.currentTarget.scrollHeight &&
      usersCount() !== users()?.users.length
    ) {
      setUsersCount(users()?.users.length);
      refetchUsers(cursor);
    }
  };

  const handleOpen = () => {
    const delegateId = createUniqueId();
    WindowManager.shared.addWindow(
      createWindowURL('system://FileSystem/OpenPath', {
        delegateId,
        message:
          'Type the handle or DID of a user, and Bluesky will open it for you.',
      }),
      {
        active: true,
        parentId: p.window.id,
      },
    );

    WindowManager.shared.handleOnce(
      delegateId,
      (event) => {
        if (event.filePath) {
          setOptions((options) => ({ ...options, did: event.filePath! }));
          contentElement?.scrollTo(0, 0);
        }
        WindowManager.shared.setActiveWindow(p.window);
      },
      FSOpenPathEventSchema,
    );
  };

  const handleMenuSelect = (id: string) => {
    switch (id) {
      case 'Follows':
      case 'Following': {
        setUsersCount(0);
        setOptions((options) => ({
          ...options,
          type: id.toLowerCase() as any,
        }));

        contentElement?.scrollTo(0, 0);
        break;
      }

      case 'Open': {
        handleOpen();
        break;
      }

      case 'Exit': {
        WindowManager.shared.closeWindow(p.window.id);
        break;
      }
    }
  };

  return (
    <>
      <MenuBar
        items={[
          {
            type: 'item',
            id: 'File',
            label: 'File',
            submenu: [
              {
                type: 'item',
                id: 'Open',
                label: 'Open...',
              },
              {
                type: 'separator',
              },
              {
                type: 'item',
                id: 'Exit',
                label: 'Exit',
              },
            ],
          },
          /* TODO: Maybe fix bug? {
            type: 'item',
            id: 'View',
            label: 'View',
            submenu: [
              {
                type: 'item',
                id: 'Follows',
                label: 'Following',
                checked: options().type === 'follows' ? 'radio' : undefined,
              },
              {
                type: 'item',
                id: 'Followers',
                label: 'Followers',
                checked: options().type === 'followers' ? 'radio' : undefined,
              },
            ],
          }, */
          /* TODO: Implement {
            type: 'item',
            id: 'Search',
            label: 'Search',
            submenu: [
              {
                type: 'item',
                id: 'Find',
                label: 'Find...',
              },
              {
                type: 'item',
                id: 'FindNext',
                label: 'Find Next',
              },
            ],
          }, */
          {
            type: 'item',
            id: 'Help',
            label: 'Help',
            submenu: [
              {
                type: 'item',
                id: 'About',
                label: 'About Bluesky',
              },
            ],
          },
        ]}
        onSelect={handleMenuSelect}
      />
      <Show when={users()?.users}>
        <div
          classList={{
            Field: true,
            [styles.UserList!]: true,
          }}
        >
          <div
            class="Content Vertical"
            ref={contentElement}
            onScroll={handleScroll}
          >
            <For each={users()?.users}>
              {(user) => (
                <>
                  <button
                    class="GhostButton"
                    onClick={() => handleUserClick(user.handle)}
                    type="button"
                  >
                    <div class={styles.UserItem}>
                      <div class={styles.UserItemAvatar}>
                        <Show when={user.avatar}>
                          <div class={styles.UserItemAvatarImage}>
                            <img src={user.avatar} />
                          </div>
                        </Show>
                      </div>
                      <div class={styles.UserItemInfo}>
                        <div class={styles.UserItemNameHandle}>
                          <div class={styles.UserItemName}>
                            {user.displayName}
                          </div>
                          <div class={styles.UserItemHandle}>
                            @{user.handle}
                          </div>
                        </div>
                        <div class={styles.UserItemDescription}>
                          {user.description}
                        </div>
                      </div>
                    </div>
                  </button>

                  <hr class={styles.PostSeparator!} />
                </>
              )}
            </For>
          </div>
        </div>
      </Show>
      <Show when={users.state === 'pending'}>
        <LoadingAnimation />
      </Show>
    </>
  );
}
