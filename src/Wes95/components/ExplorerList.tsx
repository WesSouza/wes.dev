import { For, Match, Switch } from 'solid-js';
import { Button } from './Button';
import { Icon } from './Icon';

export type Item = {
  id: string;
  name: string;
  icon: string;
  columns?: Record<string, { value: string; sortValue: string | number }>;
};

export function ExplorerList(p: {
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
        <table class="ExplorerList -details">
          <thead>
            <tr>
              <th>
                <Button class="ExplorerListHeaderButton">Name</Button>
              </th>
              <For each={p.columns}>
                {(column) => (
                  <th>
                    <Button class="ExplorerListHeaderButton">
                      {column.name}
                    </Button>
                  </th>
                )}
              </For>
            </tr>
          </thead>
          <tbody>
            <For each={p.items}>
              {(item) => (
                <tr class="ExplorerListItem">
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
            ExplorerList: true,
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
              <li class="ExplorerListItem">
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
                  <span class="ExplorerListItemLabel">{item.name}</span>
                </Button>
              </li>
            )}
          </For>
        </ul>
      </Match>
    </Switch>
  );
}
