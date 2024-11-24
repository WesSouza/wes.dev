import { createEffect } from 'solid-js';
import { z } from 'zod';
import { WindowManager } from '../../lib/WindowManager';
import type { WindowState } from '../../models/WindowState';

export const MessageDialogDataSchema = z.object({
  delegateId: z.string(),
  message: z.string(),
  title: z.string(),
  type: z.enum(['error', 'info', 'question', 'warning']).catch('info'),
});

export type MessageDialogData = z.infer<typeof MessageDialogDataSchema>;

export const MessageDialogEventSchema = z
  .object({
    action: z.enum(['ok', 'yes', 'no', 'cancel']),
  })
  .brand<'Message/MessageDialogEvent'>();

export type MessageDialogEvent = z.infer<typeof MessageDialogEventSchema>;

export function MessageDialogWindow(p: {
  data: MessageDialogData;
  window: WindowState;
}) {
  createEffect(() => {
    WindowManager.shared.setWindow(p.window.id, (window) => {
      window.title = p.data.title;
    });
  });

  return <>{p.data.message}</>;
}
