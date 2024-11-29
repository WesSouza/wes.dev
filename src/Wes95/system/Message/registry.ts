import { z } from 'zod';
import { MessageDialogWindow } from './MessageDialogWindow';

export const MessageDialogDataSchema = z.object({
  delegateId: z.string(),
  message: z.string(),
  title: z.string(),
  type: z.enum(['error', 'info', 'question', 'warning']).catch('info'),
});

export type MessageDialogData = z.infer<typeof MessageDialogDataSchema>;

export const MessageDialogEventSchema = z
  .object({
    button: z.string(),
  })
  .brand<'Message/MessageDialogEvent'>();

export type MessageDialogEvent = z.infer<typeof MessageDialogEventSchema>;

export function registerMessage() {
  return {
    name: 'Message',
    windows: {
      MessageDialog: {
        schema: MessageDialogDataSchema,
        window: MessageDialogWindow,
      },
    },
  };
}
