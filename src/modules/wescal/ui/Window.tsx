import { type JSX } from 'solid-js';

import { classList } from '../../../utils/jsx';
import Styles from './Window.module.css';

export function Window(props: {
  children?: JSX.Element;
  onClose?: () => void;
  onFullScreen?: () => void;
  onMinimize?: () => void;
  title: string;
}) {
  return (
    <div class={Styles.Window}>
      <div class={Styles.WindowTitle}>
        <div class={Styles.WindowSemaphore}>
          {/* @ts-expect-error Type 'undefined' is not assignable to type 'EventHandlerUnion<HTMLButtonElement, MouseEvent>'. ts(2375) */}
          <button
            aria-label="Close Window"
            classList={classList([
              Styles.WindowSemaphoreButton,
              Styles.CloseWindowButton,
            ])}
            onClick={props.onClose}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              class={Styles.WindowSemaphoreIcon}
            >
              <path
                fill="currentColor"
                d="M3 3.707 3.707 3 9.01 8.303l-.707.707z"
              />
              <path
                fill="currentColor"
                d="m8.303 3 .707.707L3.707 9.01 3 8.303z"
              />
            </svg>
          </button>
          {/* @ts-expect-error Type 'undefined' is not assignable to type 'EventHandlerUnion<HTMLButtonElement, MouseEvent>'. ts(2375) */}
          <button
            aria-label="Minimize Window"
            classList={classList([
              Styles.WindowSemaphoreButton,
              Styles.MinimizeWindowButton,
            ])}
            onClick={props.onMinimize}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              class={Styles.WindowSemaphoreIcon}
            >
              <path fill="currentColor" d="M2 5h8v2H2z" />
            </svg>
          </button>
          {/* @ts-expect-error Type 'undefined' is not assignable to type 'EventHandlerUnion<HTMLButtonElement, MouseEvent>'. ts(2375) */}
          <button
            aria-label="Full Screen Window"
            classList={classList([
              Styles.WindowSemaphoreButton,
              Styles.FullScreenWindowButton,
            ])}
            onClick={props.onFullScreen}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              class={Styles.WindowSemaphoreIcon}
            >
              <path fill="currentColor" d="M3 7V3h4L3 7ZM9 5v4H5l4-4Z" />
            </svg>
          </button>
        </div>
        <h1 class={Styles.WindowTitleText}>{props.title}</h1>
        <div class={Styles.WindowAntiSemaphore}></div>
      </div>
      <div class={Styles.WindowContents}>{props.children}</div>
    </div>
  );
}
