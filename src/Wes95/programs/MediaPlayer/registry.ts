import { z } from 'zod';
import type { ProgramRegistry } from '../../lib/WindowManager';
import { MediaPlayerMainWindow } from './MainWindow';

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
        files: [{ match: /\.(mp3|m4a|mp4|wav)$/, param: 'open' }],
        urls: [
          { match: /^(?<open>https?:\/\/youtu.be\/[^/?]+)/ },
          { match: /^(?<open>https:\/\/www.youtube.com\/watch?v=[^&]+)/ },
        ],
      },
    },
  };
}
