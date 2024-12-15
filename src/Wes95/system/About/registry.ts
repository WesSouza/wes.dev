import { z } from 'zod';
import { AboutWindow } from './MainWindow';

export const AboutDataSchema = z.object({
  appIcon: z.string().optional(),
  appName: z.string().optional(),
});

export type AboutData = z.infer<typeof AboutDataSchema>;

export function registerAbout() {
  return {
    name: 'About',
    windows: {
      Main: {
        schema: AboutDataSchema,
        window: AboutWindow,
      },
    },
  };
}
