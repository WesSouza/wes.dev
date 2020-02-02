/** @jsx jsx */
import { jsx } from '@emotion/core';

/**
 * When contained in a stack, the divider extends across the minor axis of the
 * stack, or horizontally when not in a stack.
 */
export function Divider() {
  return (
    <div
      css={{
        width: '100%',
        height: 1,
      }}
    />
  );
}
