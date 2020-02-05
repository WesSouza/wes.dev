import React, { createElement } from 'react';
import { render } from 'react-dom';

import { WesExplorer } from './system/WesExplorer';

if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).state = require('./state');

render(createElement(WesExplorer), document.getElementById('vga'));
