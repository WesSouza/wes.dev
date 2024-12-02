import { z } from 'zod';
import { MediaPlayerMainWindow } from './MainWindow';

export const MediaPlayerMainDataSchema = z.object({
  open: z.string().optional(),
});

export type MediaPlayerMainData = z.infer<typeof MediaPlayerMainDataSchema>;

export function registerMediaPlayer() {
  return {
    name: 'MediaPlayer',
    windows: {
      Main: {
        schema: MediaPlayerMainDataSchema,
        window: MediaPlayerMainWindow,
      },
    },
  };
}
