import { CSSObject } from '@emotion/core';

import { Colors, Flows } from '~/constants/Styles';

export interface RenderingProps {
  bold?: boolean;
  disabled?: boolean;
  flow?: Flows;
  height?: number;
  width?: number;
}

function numericValue(value?: number): number | undefined {
  return typeof value === 'number' ? value : undefined;
}

export function propsToCss({
  bold,
  disabled,
  flow,
  height,
  width,
}: RenderingProps): CSSObject {
  return {
    color: disabled ? Colors.darkGray : undefined,
    fontWeight: bold ? 'bold' : undefined,
    flexDirection: flow ?? 'column',
    height: numericValue(height),
    width: numericValue(width),
  };
}
