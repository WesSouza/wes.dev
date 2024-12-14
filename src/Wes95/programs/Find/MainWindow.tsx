import { createEffect, createSignal, onCleanup, onMount } from 'solid-js';
import { Button } from '../../components/Button';
import { LoadingAnimation } from '../../components/LoadingAnimation';
import { Progress } from '../../components/Progress';
import { WindowManager } from '../../lib/WindowManager';
import type { WindowState } from '../../models/WindowState';
import { getRandomNumber } from '../../utils/random';

const Messages = [
  'Cancelling ISP subscription',
  'Checking AOL mail',
  'Checking errors for more errors',
  'Creating MSN Messenger account',
  'Deleting located files',
  'Deleting temporary files',
  'Dialing Internet Service Provider',
  'Emailing all your contacts',
  'Extruding mesh terrain',
  'Filing deleted locations',
  'Locating deleted files',
  'Normalizing social network',
  'Rebuilding paint database',
  'Reinstalling Windows 3.11',
  'Restoring temporary files',
  'Reticulating splines',
  'Scanning disk surface',
  'Searching for answers',
  'Searching for updates',
  'Setting Internet Explorer as default',
  'Uninstalling explorer.exe',
  'Unplugging and plugging it back',
  'Upgrading to Windows XP Service Pack 2',
  'Validating malware',
  'Verifying ICQ number',
].toSorted(() => (Math.random() > 0.5 ? -1 : 1));

const MessageOnScreenDelay = 3000;
const ProgressDelay = 750;

export function FindMainWindow(p: { window: WindowState }) {
  let messageTimer: number | undefined;
  let progressTimer: number | undefined;
  const [message, setMessage] = createSignal(0);
  const [progress, setProgress] = createSignal(0);

  onMount(() => {
    WindowManager.shared.init(p.window.id, {
      title: 'Find',
      icon: 'iconFind',
      width: 400,
      height: 250,
    });
  });

  createEffect(() => {
    handleMessage();
    handleProgress();

    onCleanup(() => {
      window.clearTimeout(messageTimer);
      window.clearTimeout(progressTimer);
    });
  });

  const handleMessage = () => {
    setMessage((message) => (message > Messages.length - 2 ? 0 : message + 1));
    messageTimer = window.setTimeout(
      handleMessage,
      MessageOnScreenDelay + getRandomNumber(-500, 500),
    );
  };

  const handleProgress = () => {
    setProgress((progress) =>
      Math.random() > 0.4 && progress < 0.8 ? progress + 0.05 : progress - 0.05,
    );

    progressTimer = window.setTimeout(
      handleProgress,
      ProgressDelay + getRandomNumber(-500, 500),
    );
  };

  const handleCancelClick = () => {
    WindowManager.shared.closeWindow(p.window.id);
  };

  return (
    <div class="Vertical FlexGrow MediumSpacing">
      <LoadingAnimation animation="Flashlight" />
      <div class="Horizontal MediumGap">
        <div style={{ width: '80%' }}>
          <Progress appearance="blocks" value={progress()} />
        </div>
        <Button onClick={handleCancelClick}>Cancel</Button>
      </div>
      <div>{Messages[message()]}</div>
    </div>
  );
}
