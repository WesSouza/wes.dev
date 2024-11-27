import { For, Match, Switch } from 'solid-js';
import { Icon } from './Icon';

export type Item = {
  id: string;
  name: string;
  icon: string;
  columns?: Record<string, { value: string; sortValue: string }>;
};

export function ItemList(p: {
  appearance?: 'icons' | 'list' | 'details';
  columns?: { key: string; name: string }[];
  items: Item[];
  onChange?: (selectedId: string | undefined) => void;
}) {
  const handleItemClick = (item: Item) => {
    p.onChange?.(item.id);
  };

  return (
    <Switch>
      <Match when={p.appearance === 'details'}>
        <table class="ItemList">
          <thead>
            <tr>
              <th>Name</th>
              <For each={p.columns}>{(column) => <th>{column.name}</th>}</For>
            </tr>
          </thead>
          <tbody>
            <For each={p.items}>
              {(item) => (
                <tr class="Item">
                  <td>
                    <button
                      class="LinkButton"
                      onClick={() => handleItemClick(item)}
                      type="button"
                    >
                      <Icon icon={item.icon} />
                      <span>{item.name}</span>
                    </button>
                  </td>
                  <For each={p.columns}>
                    {(column) => <td>{item.columns?.[column.key]?.value}</td>}
                  </For>
                </tr>
              )}
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
        >
          <For each={p.items}>
            {(item) => (
              <li class="Item">
                <button
                  class="LinkButton"
                  onClick={() => handleItemClick(item)}
                  type="button"
                >
                  <Icon
                    icon={item.icon}
                    size={p.appearance === 'icons' ? 'large' : 'small'}
                  />
                  <span>{item.name}</span>
                </button>
              </li>
            )}
          </For>
        </ul>
      </Match>
    </Switch>
  );
}
