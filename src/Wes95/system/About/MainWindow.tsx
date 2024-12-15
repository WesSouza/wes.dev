import { createEffect, createResource, onMount, Show } from 'solid-js';
import { WES95_ACKNOWLEDGEMENTS_PATH } from '../../../config';
import { Button } from '../../components/Button';
import { Icon } from '../../components/Icon';
import { WindowManager } from '../../lib/WindowManager';
import type { WindowState } from '../../models/WindowState';
import { type AboutData } from './registry';

const getAcknowledgements = async () => {
  const request = await fetch(WES95_ACKNOWLEDGEMENTS_PATH);
  return await request.text();
};

export function AboutWindow(p: { data: AboutData; window: WindowState }) {
  onMount(() => {
    WindowManager.shared.init(p.window.id, {
      centerToParent: true,
      width: 450,
      height: 500,
    });
  });

  createEffect(() => {
    WindowManager.shared.setWindow(p.window.id, (window) => {
      window.title = 'About' + (p.data.appName ? ' - ' + p.data.appName : '');
    });
  });

  const [acknowledgements] = createResource(getAcknowledgements);

  const handleClose = () => {
    WindowManager.shared.closeWindow(p.window.id);
  };

  return (
    <div class="Horizontal MediumSpacing" style={{ overflow: 'hidden' }}>
      <Icon icon={p.data.appIcon ?? 'iconWes'} size="medium" />
      <div class="Vertical MediumGap" style={{ overflow: 'hidden' }}>
        <Show when={p.data.appName}>{p.data.appName}</Show>
        <div>Wes 95</div>
        <div>
          Copyright &copy; 1986&ndash;{new Date().getFullYear()} Wes Souza
        </div>
        <div class="Field">
          <div
            class="Content MediumSpacing"
            style={{ 'white-space': 'pre-wrap' }}
          >
            {acknowledgements()}
          </div>
        </div>
        <div class="Horizontal -end">
          <Button mainWindowButton onClick={handleClose}>
            Ok
          </Button>
        </div>
      </div>
    </div>
  );
}
