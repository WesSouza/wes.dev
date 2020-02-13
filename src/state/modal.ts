import { Apps } from '~/constants/Apps';
import { Icons } from '~/constants/Icons';
import { StateManager } from '~/utils/StateManager';

import { windowClose, windowOpen } from './window';

let i = 1;
function uuid() {
  return String(i++);
}

export interface ModalData {
  actions: [string, string][];
  actionCallback?: (action: string) => void;
  content: string;
  icon: Icons;
  title: string;
}

export interface Modal extends ModalData {
  id: string;
  windowId: string | null;
}

export interface ModalState {
  all: Map<string, Modal>;
}

export const initialModalState = {
  all: new Map<string, Modal>(),
};

export const modalStore = new StateManager(initialModalState);

export function modalAction(id: string, action: string | 'close') {
  const modal = modalStore.state.all.get(id);
  if (!modal) {
    return;
  }

  modal.actionCallback?.call(null, action);

  modalStore.mutate(state => {
    state.all.delete(id);
  });

  const { windowId } = modal;
  if (windowId) {
    windowClose(windowId);
  }
}

export function modalOpen(modal: ModalData) {
  const id = uuid();
  modalStore.mutate(state => {
    state.all.set(id, {
      id,
      windowId: null,
      ...modal,
    });
  });

  const windowId = windowOpen(Apps.modal, id);

  modalStore.mutate(state => {
    const modal = state.all.get(id);
    if (modal) {
      modal.windowId = windowId;
    }
  });
}

export function modalWindowClosed(windowId: string) {
  for (const [id, modal] of modalStore.state.all) {
    if (modal.windowId !== windowId) {
      continue;
    }

    modalAction(id, 'close');
  }
}

export function modalGetAll(state: ModalState) {
  return state.all;
}
