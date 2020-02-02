/** @jsx jsx */
import { jsx } from '@emotion/core';

import { HStack, HStackProps } from './HStack';

interface Props extends HStackProps {
  /**
   * Number of sub-views per line of content.
   */
  columns: number;

  /**
   * Spacing between sub-views.
   */
  spacing: number;
}

/**
 * A view that arranges its children in a vertical line.
 */
export function Grid({
  columns,
  children,
  spacing,
  UNSTABLE_css,
  ...props
}: Props) {
  const css = {
    ...UNSTABLE_css,
    [`> *:not(:nth-child(${columns}n+1))`]: {
      marginLeft: spacing,
    },
    '> *': {
      // FIXME: This calculation is not accurate, god know why
      width: `calc(calc(100% / ${columns}) - ${(spacing / 2) *
        (columns - 1)}px)`,
      marginBottom: spacing,
    },
  };
  return (
    <HStack wrap={true} UNSTABLE_css={css} {...props}>
      {children}
    </HStack>
  );
}
