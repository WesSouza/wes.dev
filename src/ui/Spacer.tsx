/** @jsx jsx */
import { jsx } from '@emotion/core';

interface Props {
  /**
   * The minimum length this spacer can be shrunk to, along the axis or axes of
   * expansion.
   */
  minLength?: number;
}

/**
 * A flexible space that expands along the major axis of its containing stack
 * layout.
 */
export function Spacer({ minLength }: Props) {
  return (
    <div
      css={{
        flexGrow: minLength ? undefined : 1,
        flexShrink: minLength ? 0 : undefined,
        height: minLength,
        width: minLength,
      }}
    />
  );
}
