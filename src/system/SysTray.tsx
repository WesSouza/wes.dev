import React, { useCallback, useRef } from 'react';

import { Icon } from '~/components';
import { Icons, IconSizes } from '~/constants/Icons';
import { Sounds } from '~/constants/Sounds';
import { Scale } from '~/constants/Styles';
import { useClock } from '~/hooks/useClock';
import { HStack, Pressable, Text, Themes, VerticalAlignments } from '~/ui';

import { SoundBlaster, SoundBlasterController } from './SoundBlaster';

interface Props {}

export function SysTray({}: Props) {
  const clock = useClock();
  const soundBlasterController = useRef<SoundBlasterController | null>(null);

  const handleDing = useCallback(() => {
    if (soundBlasterController.current) {
      soundBlasterController.current.play();
    }
  }, []);

  return (
    <>
      <HStack
        paddingLeading={Scale * 5}
        paddingTrailing={Scale * 5}
        selfAlignment={VerticalAlignments.stretch}
        padding={Scale * 1}
        spacing={Scale * 5}
        theme={Themes.frameInsetThin}
        wrap={true}
      >
        <Pressable onPress={handleDing}>
          <Icon icon={Icons.sysTraySound} size={IconSizes.small} />
        </Pressable>
        <Text paddingTrailing={Scale}>{clock}</Text>
      </HStack>
      <SoundBlaster controller={soundBlasterController} sound={Sounds.ding} />
    </>
  );
}
