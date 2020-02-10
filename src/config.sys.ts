/* eslint-disable no-var */

function ohno(event: ErrorEvent) {
  var bsod = document.createElement('div');
  bsod.id = 'bsod';

  var errorMessage = event ? String(event).replace(/\.$/, '') + '.' : '';

  bsod.innerHTML = [
    '<h1>Oh No</h1>',
    '<p>A fatal exception has occurred. ' +
      errorMessage +
      ' The current application will be terminated.</p>',
    '<ul>',
    '  <li>Press any key to terminate the current application.</li>',
    '  <li>Press CTRL+ALT+DEL again to restart your computer. You will lose any unsaved information in all applications.</li>',
    '</ul>',
    '<p class="center">Press any key to continue <blink>_</blink></p>',
  ].join('');

  document.body.appendChild(bsod);

  function anyKeyToContinue() {
    location.reload();
  }
  window.addEventListener('keydown', anyKeyToContinue);
  window.addEventListener('mousedown', anyKeyToContinue);
  window.addEventListener('touchstart', anyKeyToContinue);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window.onerror as any) = ohno;
