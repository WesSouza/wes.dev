import React, { memo, useCallback } from 'react';

import { Button, WindowMenu, Symbol } from '~/components';
import { Icons } from '~/constants/Icons';
import { Scale, PaddingValues } from '~/constants/Styles';
import { Symbols } from '~/constants/Symbols';
import { modalOpen, windowClose } from '~/state';
import { ApplicationWindowProps } from '~/system/ApplicationWindow';
import {
  HStack,
  Image,
  Text,
  Themes,
  VStack,
  HorizontalAlignments,
  VerticalAlignments,
  Spacer,
  TruncationModes,
} from '~/ui';
import { Range } from '~/ui/Range';

function SpotifyComponent({ window }: ApplicationWindowProps) {
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
              [
                '&Browse',
                [
                  ['&Genres', 'disabled'],
                  ['&Podcasts', 'disabled'],
                  ['-'],
                  ['&New Releases', 'disabled'],
                  ['&Discover', 'disabled'],
                ],
              ],
              ['-'],
              ['E&xit', 'exit'],
            ],
          ],
          [
            '&Library',
            [
              ['Made For &You', 'disabled'],
              ['&Recently Played', 'disabled'],
              ['-'],
              ['&Liked Songs', 'disabled'],
              ['&Albums', 'disabled'],
              ['&Artists', 'disabled'],
              ['&Playlists', 'disabled'],
            ],
          ],
          [
            '&Help',
            [
              ['&Help Topics', 'disabled'],
              ['&About Spotify', 'disabled'],
            ],
          ],
        ]}
        onMenuSelect={handleMenuSelect}
      />
      <HStack shrink={0} spacing={PaddingValues.large}>
        <HStack marginTop={Scale * 2} theme={Themes.frameInset}>
          <Image
            src={
              'https://img.discogs.com/SbuVVn2RSWyO4ZKhGeL2AfDQsB4=/fit-in/600x595/filters:strip_icc():format(jpeg):mode_rgb():quality(90)/discogs-images/R-169648-1512433480-4200.jpeg.jpg'
            }
            width={Scale * 64}
            height={Scale * 64}
          />
        </HStack>
        <VStack alignment={HorizontalAlignments.leading}>
          <HStack grow={0}>
            <Text bold={true} truncationMode={TruncationModes.tail}>
              One More Time
            </Text>
          </HStack>
          <HStack grow={0} marginTop={Scale * 4}>
            <Text truncationMode={TruncationModes.tail}>Daft Punk</Text>
          </HStack>
        </VStack>
      </HStack>
      <Spacer />
      <VStack alignment={HorizontalAlignments.center}>
        <HStack shrink={0}>
          <Button padding={Scale * 4}>
            <Symbol symbol={Symbols.mediaRepeat} />
          </Button>
          <Button padding={Scale * 4}>
            <Symbol symbol={Symbols.mediaPrevious} />
          </Button>
          <Button padding={Scale * 4}>
            <Symbol symbol={Symbols.mediaPlay} />
          </Button>
          <Button padding={Scale * 4}>
            <Symbol symbol={Symbols.mediaNext} />
          </Button>
          <Button padding={Scale * 4}>
            <Symbol symbol={Symbols.mediaShuffle} />
          </Button>
        </HStack>
      </VStack>
      <VStack
        shrink={0}
        alignment={HorizontalAlignments.center}
        paddingLeading={Scale * 15}
        paddingTrailing={Scale * 15}
        paddingTop={PaddingValues.large}
        paddingBottom={0}
      >
        <Range min={0} max={1000} value={500} />
      </VStack>
      <Spacer />
      <HStack shrink={0} alignment={VerticalAlignments.stretch}>
        <HStack grow={3} padding={Scale * 2} theme={Themes.frameInsetThin}>
          <Text>Stopped</Text>
        </HStack>
        <VStack
          alignment={HorizontalAlignments.trailing}
          grow={1}
          padding={Scale * 2}
          theme={Themes.frameInsetThin}
        >
          <Text>0:00/5:20</Text>
        </VStack>
      </HStack>
    </>
  );
}

export const Spotify = memo(SpotifyComponent);
