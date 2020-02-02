/** @jsx jsx */
import { jsx } from '@emotion/core';
import React, { ReactElement } from 'react';

import { spreadLayoutPropsToCss, ViewLayoutProps } from './View';

interface Props extends ViewLayoutProps {
  ariaLabel?: string;
  height: number;
  width: number;
}

interface PropsSrc {
  src: string;
}

interface PropsSvg {
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
    });
  }

  return null;
}
