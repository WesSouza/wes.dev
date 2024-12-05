import { t } from './app';
import { wes95_bluesky } from './Wes95_Bluesky';
import { wes95_fileSystem } from './Wes95_FileSystem';

export const appRouter = t.router({
  wes95_bluesky,
  wes95_fileSystem,
});

export type AppRouter = typeof appRouter;
