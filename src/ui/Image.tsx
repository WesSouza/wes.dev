/** @jsx jsx */
import { jsx } from '@emotion/core';
import React, { ReactElement } from 'react';

import {
  spreadAccessibilityPropsToAttributes,
  spreadLayoutPropsToCss,
  ViewAccessibilityProps,
  ViewLayoutProps,
} from './View';

interface Props extends ViewAccessibilityProps, ViewLayoutProps {
  ariaLabel?: string;
  height?: string | number;
  width: string | number;
}

interface PropsSrc {
  src: string;
}

interface PropsSvg {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  svg: ReactElement<any>;
}

/**
 * A view that displays an image or SVG.
 */
export function Image({
  ariaLabel,
  height,
  width,
  ...props
}: Props & (PropsSvg | PropsSrc)) {
  if ('src' in props) {
    return (
      <img
        width={width}
        height={height}
        src={props.src}
        alt={ariaLabel ?? ''}
        css={{
          ...spreadLayoutPropsToCss(props),
          display: 'block',
        }}
        {...spreadAccessibilityPropsToAttributes(props)}
      />
    );
  }

  if ('svg' in props) {
    return React.cloneElement(props.svg, {
      width,
      height,
      style: {
        ...spreadLayoutPropsToCss(props),
        ariaLabel,
        display: 'block',
      },
      ...spreadAccessibilityPropsToAttributes(props),
    });
  }

  return null;
}
