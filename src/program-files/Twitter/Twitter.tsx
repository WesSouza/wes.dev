import React, { memo, useCallback } from 'react';

import { WindowMenu } from '~/components';
import { Icons } from '~/constants/Icons';
import { Colors, FontSizes, PaddingValues, Scale } from '~/constants/Styles';
import { modalOpen, windowClose } from '~/state';
import { ApplicationWindowProps } from '~/system/ApplicationWindow';
import {
  HorizontalAlignments,
  HStack,
  Image,
  Text,
  Themes,
  VStack,
} from '~/ui';

import { Tweet } from './components/Tweet';

function TwitterComponent({ window }: ApplicationWindowProps) {
  const { id } = window;
  const handleMenuSelect = useCallback(
    (action: string | null) => {
      switch (action) {
        case 'exit':
          windowClose(id);
          return;
      }

      modalOpen({
        actions: [['Ok', 'close']],
        content: "I'm still developing this, please try again next week.",
        icon: Icons.dialogWarning,
        title: 'Oh no',
      });
    },
    [id],
  );

  return (
    <>
      <WindowMenu
        menu={[
          [
            '&File',
            [
              ['&New...', 'disabled'],
              ['&Open...', 'disabled'],
              ['-'],
              ['E&xit', 'exit'],
            ],
          ],
          [
            '&View',
            [
              ['&Bookmarks', 'disabled'],
              ['&Messages', 'disabled'],
              ['&Notifications', 'disabled'],
              ['&Lists', 'disabled'],
            ],
          ],
          [
            '&Help',
            [
              ['&Help Topics', 'disabled'],
              ['&About Twitter', 'disabled'],
            ],
          ],
        ]}
        onMenuSelect={handleMenuSelect}
      />
      <HStack
        padding={PaddingValues.medium}
        shrink={0}
        spacing={PaddingValues.large}
      >
        <HStack theme={Themes.frameInset}>
          <Image
            src={
              'https://en.gravatar.com/userimage/4833332/e841a8b98f0ec6aeba63c10f10bbd4de.jpg?size=128'
            }
            width={Scale * 32}
            height={Scale * 32}
          />
        </HStack>
        <VStack grow={1} width="33%">
          <Text bold={true}>54</Text>
          <Text fontSize={FontSizes.half}>Posts</Text>
        </VStack>
        <VStack grow={1} width="33%">
          <Text bold={true}>474</Text>
          <Text fontSize={FontSizes.half}>Followers</Text>
        </VStack>
        <VStack grow={1} width="33%">
          <Text bold={true}>252</Text>
          <Text fontSize={FontSizes.half}>Following</Text>
        </VStack>
      </HStack>
      <VStack
        alignment={HorizontalAlignments.stretch}
        backgroundColor={Colors.gray}
        grow={1}
        theme={Themes.frameInset}
        yScroll={true}
      >
        <Tweet />
      </VStack>
    </>
  );
}

export const Twitter = memo(TwitterComponent);
