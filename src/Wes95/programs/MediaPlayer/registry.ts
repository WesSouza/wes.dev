import { z } from 'zod';
import { MediaPlayerMainWindow } from './MainWindow';
import type { ProgramRegistry } from '../../lib/WindowManager';

export const MediaPlayerMainDataSchema = z.object({
  open: z.string().optional(),
});

export type MediaPlayerMainData = z.infer<typeof MediaPlayerMainDataSchema>;

export function registerMediaPlayer(): ProgramRegistry {
  return {
    name: 'MediaPlayer',
    windows: {
      Main: {
        schema: MediaPlayerMainDataSchema,
        window: MediaPlayerMainWindow,
        urls: [
          { match: /^(?<open>https?:\/\/youtu.be\/[^/?]+)/ },
          { match: /^(?<open>https:\/\/www.youtube.com\/watch?v=[^&]+)/ },
        ],
      },
    },
  };
}
