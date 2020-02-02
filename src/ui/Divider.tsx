/** @jsx jsx */
import { jsx } from '@emotion/core';

import { Colors, Scale } from '~/constants/Styles';

/**
 * When contained in a stack, the divider extends across the minor axis of the
 * stack, or horizontally when not in a stack.
 */
export function Divider() {
  return (
    <div
      css={{
        margin: `${Scale * 4}px 0`,
        backgroundColor: Colors.white,
        borderTop: `${Scale}px solid ${Colors.darkGray}`,
        height: Scale * 2,
        width: '100%',
      }}
    />
  );
}
