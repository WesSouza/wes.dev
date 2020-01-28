import { createElement } from 'react';
import { render } from 'react-dom';

import { WesExplorer } from './program-files/WesExplorer';

render(createElement(WesExplorer), document.getElementById('vga'));
