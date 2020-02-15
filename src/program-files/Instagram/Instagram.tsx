import React, { memo, useCallback } from 'react';

import { WindowMenu } from '~/components';
import { Icons } from '~/constants/Icons';
import { FontSizes, PaddingValues, Scale } from '~/constants/Styles';
import { modalOpen, windowClose } from '~/state';
import { ApplicationWindowProps } from '~/system/ApplicationWindow';
import {
  Cursors,
  Grid,
  HorizontalAlignments,
  HStack,
  Image,
  Pressable,
  Text,
  Themes,
  VStack,
} from '~/ui';

function InstagramComponent({ window }: ApplicationWindowProps) {
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
              ['&Grid', 'disabled'],
              ['&Full Images', 'disabled'],
              ['-'],
              ['&Notifications', 'disabled'],
            ],
          ],
          ['&Search', [['&Hashtag', 'disabled']]],
          [
            '&Help',
            [
              ['&Help Topics', 'disabled'],
              ['&About Instagram', 'disabled'],
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
              'https://en.gravatar.com/userimage/4833332/86e0a00701b56156657077f8cfb23d8d.jpg?size=128'
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
        grow={1}
        theme={Themes.frameInset}
        yScroll={true}
      >
        <Grid columns={3} shrink={0} spacing={Scale * 1}>
          <Pressable cursor={Cursors.pointer}>
            <Image
              src={
                'https://instagram.fewr1-1.fna.fbcdn.net/v/t51.2885-15/sh0.08/e35/c240.0.960.960a/s640x640/79644798_452773488716748_494819712578741460_n.jpg?_nc_ht=instagram.fewr1-1.fna.fbcdn.net&_nc_cat=100&_nc_ohc=hBeW1RkbZlgAX9GeIey&oh=d597f842bc86cb876aa5884d47c09282&oe=5EC9BA25'
              }
              width="100%"
            />
          </Pressable>
          <Pressable cursor={Cursors.pointer}>
            <Image
              src={
                'https://instagram.fewr1-6.fna.fbcdn.net/v/t51.2885-15/sh0.08/e35/c0.180.1440.1440a/s640x640/72753008_547379992686270_1318218988833172521_n.jpg?_nc_ht=instagram.fewr1-6.fna.fbcdn.net&_nc_cat=106&_nc_ohc=QmbMSV2MFh0AX9xzmVa&oh=2cdce22fff19f3c91145dad6a5a6c984&oe=5EFD0039'
              }
              width="100%"
            />
          </Pressable>
          <Pressable cursor={Cursors.pointer}>
            <Image
              src={
                'https://instagram.fewr1-3.fna.fbcdn.net/v/t51.2885-15/sh0.08/e35/s640x640/74535439_2656082937782241_7454357494029284650_n.jpg?_nc_ht=instagram.fewr1-3.fna.fbcdn.net&_nc_cat=109&_nc_ohc=rIF9AD_WjQUAX-V4vVo&oh=7f34b1a14bb3aba4a402063c7af939a6&oe=5EC3A99B'
              }
              width="100%"
            />
          </Pressable>
          <Pressable cursor={Cursors.pointer}>
            <Image
              src={
                'https://instagram.fewr1-6.fna.fbcdn.net/v/t51.2885-15/sh0.08/e35/s640x640/72560605_150490899508155_3832359981885104731_n.jpg?_nc_ht=instagram.fewr1-6.fna.fbcdn.net&_nc_cat=103&_nc_ohc=TQ3BpjWoCekAX_i76sS&oh=a8aa21d5aee740262760ec898411b5a9&oe=5EFB74B0'
              }
              width="100%"
            />
          </Pressable>
          <Pressable cursor={Cursors.pointer}>
            <Image
              src={
                'https://instagram.fewr1-3.fna.fbcdn.net/v/t51.2885-15/sh0.08/e35/c180.0.1080.1080a/s640x640/71211389_165545351227354_5367479171102903459_n.jpg?_nc_ht=instagram.fewr1-3.fna.fbcdn.net&_nc_cat=110&_nc_ohc=ng7GgvF_s4cAX_IoTQ2&oh=f3550dde96060113691e2d7308a2ca8a&oe=5ECA409F'
              }
              width="100%"
            />
          </Pressable>
          <Pressable cursor={Cursors.pointer}>
            <Image
              src={
                'https://instagram.fewr1-1.fna.fbcdn.net/v/t51.2885-15/sh0.08/e35/c0.180.1440.1440a/s640x640/71343125_143646333576956_7241910773551991855_n.jpg?_nc_ht=instagram.fewr1-1.fna.fbcdn.net&_nc_cat=108&_nc_ohc=uyXQ5RWhPaYAX84yWVl&oh=859e5e84c333753d3bef40312efcb65f&oe=5EE672D9'
              }
              width="100%"
            />
          </Pressable>
          <Pressable cursor={Cursors.pointer}>
            <Image
              src={
                'https://instagram.fewr1-1.fna.fbcdn.net/v/t51.2885-15/sh0.08/e35/s640x640/69174953_510467583088656_7297680099602211397_n.jpg?_nc_ht=instagram.fewr1-1.fna.fbcdn.net&_nc_cat=100&_nc_ohc=v-p4XkKMZ6kAX_oTo5P&oh=57aa12438078d8399c4bb5c05b92c408&oe=5ECADB22'
              }
              width="100%"
            />
          </Pressable>
          <Pressable cursor={Cursors.pointer}>
            <Image
              src={
                'https://instagram.fewr1-5.fna.fbcdn.net/v/t51.2885-15/sh0.08/e35/s640x640/68702813_499031074208921_4070092837643833345_n.jpg?_nc_ht=instagram.fewr1-5.fna.fbcdn.net&_nc_cat=105&_nc_ohc=LDkmXgmd-WoAX9lyEvL&oh=9a6d09310cf494dbd52c3353bf26d72b&oe=5ECE28A4'
              }
              width="100%"
            />
          </Pressable>
          <Pressable cursor={Cursors.pointer}>
            <Image
              src={
                'https://instagram.fewr1-6.fna.fbcdn.net/v/t51.2885-15/sh0.08/e35/c0.180.1440.1440a/s640x640/66615322_487370768666161_6403881361930059663_n.jpg?_nc_ht=instagram.fewr1-6.fna.fbcdn.net&_nc_cat=101&_nc_ohc=lN_AmsmSxeAAX_J_Ife&oh=9fb1a6a1344e2892b4983615d4691f28&oe=5EF84640'
              }
              width="100%"
            />
          </Pressable>
          <Pressable cursor={Cursors.pointer}>
            <Image
              src={
                'https://instagram.fewr1-5.fna.fbcdn.net/v/t51.2885-15/sh0.08/e35/s640x640/62526500_152733309206753_6236531873621243293_n.jpg?_nc_ht=instagram.fewr1-5.fna.fbcdn.net&_nc_cat=105&_nc_ohc=j2N8tiep3J8AX9un1AD&oh=afd05c714ce7fed8000fa4332924a952&oe=5EFB5DCF'
              }
              width="100%"
            />
          </Pressable>
          <Pressable cursor={Cursors.pointer}>
            <Image
              src={
                'https://instagram.fewr1-6.fna.fbcdn.net/v/t51.2885-15/sh0.08/e35/c144.0.1152.1152a/s640x640/61062511_434601033990135_5954648049556038236_n.jpg?_nc_ht=instagram.fewr1-6.fna.fbcdn.net&_nc_cat=103&_nc_ohc=2KH_jgi61s8AX_wY6gR&oh=6615eb75ed8cbe88f1891fe58b659eea&oe=5EC6C30E'
              }
              width="100%"
            />
          </Pressable>
          <Pressable cursor={Cursors.pointer}>
            <Image
              src={
                'https://instagram.fewr1-3.fna.fbcdn.net/v/t51.2885-15/sh0.08/e35/c108.0.864.864a/s640x640/58684993_2388234828073222_918621075420712189_n.jpg?_nc_ht=instagram.fewr1-3.fna.fbcdn.net&_nc_cat=110&_nc_ohc=vlnflWxwhLkAX-HPK9p&oh=35fa2b42bebd8593005098400b4c6563&oe=5EE2F75E'
              }
              width="100%"
            />
          </Pressable>
        </Grid>
      </VStack>
    </>
  );
}

export const Instagram = memo(InstagramComponent);
