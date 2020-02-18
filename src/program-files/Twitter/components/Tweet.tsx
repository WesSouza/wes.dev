import React, { memo } from 'react';

import { Scale } from '~/constants/Styles';
import {
  HStack,
  Image,
  Text,
  Themes,
  VerticalAlignments,
  VStack,
  HorizontalAlignments,
} from '~/ui';

interface Props {}

function TweetComponent({}: Props) {
  return (
    <HStack alignment={VerticalAlignments.top}>
      <HStack theme={Themes.frameInset}>
        <Image
          src={
            'https://en.gravatar.com/userimage/4833332/e841a8b98f0ec6aeba63c10f10bbd4de.jpg?size=128'
          }
          width={Scale * 32}
          height={Scale * 32}
        />
      </HStack>

      <VStack
        alignment={HorizontalAlignments.leading}
        UNSTABLE_css={{ minWidth: 0 }}
      >
        <HStack UNSTABLE_css={{ minWidth: 0 }}>
          <Text bold={true}>Wes.dev</Text>
          <Text>@__WesSouza</Text>
          <Text>&sdot;</Text>
          <Text>41m</Text>
        </HStack>

        <HStack>
          <Text nl2br={true}>They arrived!{'\n\n'}@donavon #queerjs</Text>
        </HStack>

        <Image
          src="https://pbs.twimg.com/media/ERBLOEdWAAEP2i1?format=jpg&name=small"
          width="100%"
          ratio={16 / 9}
        />
        <HStack></HStack>
      </VStack>
    </HStack>
  );
}

export const Tweet = memo(TweetComponent);
