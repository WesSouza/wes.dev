import React, { memo, useCallback } from 'react';

import { WindowMenu } from '~/components';
import { TextField } from '~/components/TextField';
import { Icons } from '~/constants/Icons';
import { PaddingValues } from '~/constants/Styles';
import { modalOpen, windowClose } from '~/state';
import { ApplicationWindowProps } from '~/system/ApplicationWindow';
import { Themes } from '~/ui';

const helloWorld = `Hi! I'm Wes.

I am a senior developer at Work & Co, working on web and mobile application projects.

Feel free to explore around.`;

function NotepadComponent({ window }: ApplicationWindowProps) {
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
              ['&Save', 'disabled'],
              ['Save &As...', 'disabled'],
              ['-'],
              ['Page Se&tup...', 'disabled'],
              ['&Print', 'disabled'],
              ['-'],
              ['E&xit', 'exit'],
            ],
          ],
          [
            '&Edit',
            [
              ['&Undo', 'disabled', 'Ctrl+Z'],
              ['-'],
              ['Cu&t', 'disabled', 'Ctrl+X'],
              ['&Copy', 'disabled', 'Ctrl+C'],
              ['&Paste', 'disabled', 'Ctrl+V'],
              ['De&lete', 'disabled', 'Del'],
              ['-'],
              ['Select &All', 'disabled'],
              ['Time/&Date', 'disabled', 'F5'],
              ['-'],
              ['&Word Wrap', 'disabled'],
            ],
          ],
          [
            '&Search',
            [
              ['&Find...', 'disabled'],
              ['Find &Next', 'disabled', 'F3'],
            ],
          ],
          [
            '&Help',
            [
              ['&Help Topics', 'disabled'],
              ['&About Notepad', 'disabled'],
            ],
          ],
        ]}
        onMenuSelect={handleMenuSelect}
      />
      <TextField
        multiLine={true}
        grow={1}
        padding={PaddingValues.medium}
        theme={Themes.frameInset}
        value={window.file === 'hello-world.txt' ? helloWorld : ''}
      />
    </>
  );
}

export const Notepad = memo(NotepadComponent);
