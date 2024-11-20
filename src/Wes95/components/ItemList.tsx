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
  onChange: (selectedIds: string[]) => void;
}) {
  const groupId = createUniqueId();

  const handleChange = () => {
    const checked = Array.from(
      document.querySelectorAll(`[data-group="${groupId}"]:checked`),
    )
      .map((item) => item.getAttribute('data-id'))
      .filter(Boolean) as string[];
    p.onChange(checked);
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
        >
          <For each={p.items}>
            {(item) => {
              const id = createUniqueId();
              return (
                <li class="Item">
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
