import { For, Match, Switch } from 'solid-js';
import { Icon } from './Icon';
import { Button } from './Button';

export type Item = {
  id: string;
  name: string;
  icon: string;
  columns?: Record<string, { value: string; sortValue: string }>;
};

export function ItemList(p: {
  appearance?: 'icons' | 'icons-vertical' | 'list' | 'details';
  columns?: { key: string; name: string }[];
  items: Item[];
  onSelect?: (selectedId: string) => void;
}) {
  const handleItemClick = (item: Item) => {
    p.onSelect?.(item.id);
  };

  return (
    <Switch>
      <Match when={p.appearance === 'details'}>
        <table class="ItemList -table">
          <thead>
            <tr>
              <th>
                <Button class="HeaderButton">Name</Button>
              </th>
              <For each={p.columns}>
                {(column) => (
                  <th>
                    <Button class="HeaderButton">{column.name}</Button>
                  </th>
                )}
              </For>
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
            '-icons':
              p.appearance === 'icons' || p.appearance === 'icons-vertical',
            '-list':
              !p.appearance ||
              p.appearance === 'list' ||
              p.appearance === 'icons-vertical',
          }}
        >
          <For each={p.items}>
            {(item) => (
              <li class="Item">
                <Button appearance="Link" onClick={() => handleItemClick(item)}>
                  <Icon
                    icon={item.icon}
                    size={
                      p.appearance === 'icons' ||
                      p.appearance === 'icons-vertical'
                        ? 'medium'
                        : 'small'
                    }
                  />
                  <span class="ItemLabel">{item.name}</span>
                </Button>
              </li>
            )}
          </For>
        </ul>
      </Match>
    </Switch>
  );
}
