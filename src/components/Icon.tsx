import React from 'react';

import { Icons, IconSizes, IconSrcs } from '~/constants/Icons';
import { Scale } from '~/constants/Styles';
import { Image, ViewLayoutProps } from '~/ui';

const SizeMap = {
  [IconSizes.large]: 32 * Scale,
  [IconSizes.small]: 16 * Scale,
};

interface Props extends ViewLayoutProps {
  icon: Icons;
  size: IconSizes;
}

export function Icon({ icon, size, ...props }: Props) {
  const widthHeight = SizeMap[size];
  return (
    <Image
      src={IconSrcs[icon][size]}
      width={widthHeight}
      height={widthHeight}
      {...props}
    />
  );
}
