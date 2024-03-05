import { Show, type Accessor, type JSX } from 'solid-js';

import Styles from './Popover.module.css';

export function Popover(props: {
  children: JSX.Element;
  position: Accessor<DOMRect | undefined>;
  showWhen: Accessor<boolean>;
}) {
  return (
    <Show when={props.showWhen()}>
      <div
        class={Styles.Popover}
        style={{
          '--top': `${props.position()?.top ?? 0}px`,
          '--left': `${props.position()?.left ?? 0}px`,
          '--width': `${props.position()?.width ?? 0}px`,
        }}
      >
        {props.children}
      </div>
    </Show>
  );
}
