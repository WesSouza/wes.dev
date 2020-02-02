/** @jsx jsx */
import { jsx } from '@emotion/core';

import { Desktop, Frame, Window, WindowMenu } from '~/components';
import { Icons } from '~/constants/Icons';
import { Paddings } from '~/constants/Styles';

export function WesExplorer() {
  return (
    <Desktop>
      <div
        css={{
          padding: 30,
        }}
      >
        <Window
          title="About Me - Notepad"
          icon={Icons.fileTypeText}
          isActive={true}
          onClose={() => {}}
          onMaximize={() => {}}
          onMinimize={() => {}}
        >
          <WindowMenu
            menu={{
              File: {},
              Edit: {},
              Search: {},
              Help: {},
            }}
            onMenuSelect={() => {}}
          />
          <Frame padding={Paddings.large}>
            Hi! I’m Wes.
            <br />
            <br />
            I am a senior developer at Work &amp; Co, working on web and mobile
            application projects.
            <br />
            <br />
            You can read my articles, check out my projects, watch a tech talk
            and follow my Twitter or Instagram.
            <br />
            <br />
            I live and work in the Downtown Brooklyn area in New York.
            <br />
            <br />
            I have collaborated on great products for Aesop, Equinox, Haus,
            Philz Coffee and T-Mobile. Previously, I worked fo Booking.com,
            Scup, Univision, and MTV Brasil.
            <br />
            <br />
            You can get in touch with me via email at hey@wes.dev.
            <br />
          </Frame>
        </Window>
      </div>
    </Desktop>
  );
}
