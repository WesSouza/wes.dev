import React from 'react';

import { Box, Button, Desktop, Frame, Window } from '~/components';
import { Paddings, Flows } from '~/constants/Styles';

export function WesExplorer() {
  return (
    <>
      <Desktop>
        <Window padding={Paddings.small} flow={Flows.inline}>
          <Frame padding={Paddings.medium}>Text content</Frame>
          <Frame padding={Paddings.medium}>Text content</Frame>
        </Window>
        <Window padding={Paddings.medium}>
          <Box padding={Paddings.large} flow={Flows.inline}>
            <Button>OK</Button>
            <Button>OK</Button>
            <Button>OK</Button>
          </Box>
        </Window>
      </Desktop>
    </>
  );
}
