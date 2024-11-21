import { createUniqueId, For, Match, Switch } from 'solid-js';
import { Icon } from './Icon';

export type Item = {
  id: string;
  name: string;
  icon: string;
  columns?: Record<string, { value: string; sortValue: string }>;
};

export function ItemList(p: {
  appearance?: 'icons' | 'list' | 'details' | undefined;
  columns?: { key: string; name: string }[] | undefined;
  items: Item[];
  onChange?: (selectedId: string | undefined) => void;
  onItemDblClick?: () => void;
}) {
  const groupId = createUniqueId();

  const handleChange = () => {
    const checked =
      document
        .querySelector(`[data-group="${groupId}"]:checked`)
        ?.getAttribute('data-id') ?? undefined;
    p.onChange?.(checked);
  };

  const handleListClick = (event: MouseEvent & { target: Element }) => {
    if (event.target.tagName !== 'INPUT') {
      const checkedElement: HTMLInputElement | null = document.querySelector(
        `[data-group="${groupId}"]:checked`,
      );
      if (checkedElement) {
        checkedElement.checked = false;
      }
      p.onChange?.(undefined);
    }
  };

  return (
    <Switch>
      <Match when={p.appearance === 'details'}>
        <table class="ItemList" onClick={handleListClick}>
          <thead>
            <tr>
              <th>Name</th>
              <For each={p.columns}>{(column) => <th>{column.name}</th>}</For>
            </tr>
          </thead>
          <tbody>
            <For each={p.items}>
              {(item) => {
                const id = createUniqueId();
                return (
                  <tr class="Item">
                    <td>
                      <input
                        type="radio"
                        name={groupId}
                        id={id}
                        data-group={groupId}
                        data-id={item.id}
                        onChange={() => handleChange()}
                      />

                      <label for={id}>
                        <Icon icon={item.icon} />
                        <span>{item.name}</span>
                      </label>
                    </td>
                    <For each={p.columns}>
                      {(column) => <td>{item.columns?.[column.key]?.value}</td>}
                    </For>
                  </tr>
                );
              }}
            </For>
          </tbody>
        </table>
      </Match>
      <Match when={p.appearance !== 'details'}>
        <ul
          classList={{
            ItemList: true,
            '-icons': p.appearance === 'icons',
            '-list': !p.appearance || p.appearance === 'list',
          }}
          onClick={handleListClick}
        >
          <For each={p.items}>
            {(item) => {
              const id = createUniqueId();
              return (
                <li class="Item" onDblClick={() => p.onItemDblClick?.()}>
                  <input
                    type="radio"
                    name={groupId}
                    id={id}
                    data-group={groupId}
                    data-id={item.id}
                    onChange={() => handleChange()}
                  />

                  <label for={id}>
                    <Icon
                      icon={item.icon}
                      size={p.appearance === 'icons' ? 'large' : 'small'}
                    />
                    <span>{item.name}</span>
                  </label>
                </li>
              );
            }}
          </For>
        </ul>
      </Match>
    </Switch>
  );
}
