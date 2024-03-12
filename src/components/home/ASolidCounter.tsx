import { createResource, Match, Switch } from 'solid-js';

const fetchCount = async () =>
  (await fetch('./counter')).json() as Promise<{ count: number }>;

export function ASolidCounter() {
  const [count] = createResource(fetchCount);
  return (
    <Switch>
      <Match when={count.loading}>
        <div class="CounterLoading" aria-label="Counter is loading"></div>
      </Match>
      <Match when={count.loading}>
        <div class="CounterError" aria-label="Error reading counter"></div>
      </Match>
      <Match when={count() !== undefined}>
        <div class="CounterNumber">{count()?.count}</div>
      </Match>
    </Switch>
  );
}
