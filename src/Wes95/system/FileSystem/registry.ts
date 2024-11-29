import { z } from 'zod';
import { FileSystemOpenPathWindow } from './OpenPathWindow';
import { FileSystemOpenWindow } from './OpenWindow';

export const FSOpenDataSchema = z.object({
  delegateId: z.string(),
  fileTypes: z.array(z.string()),
  path: z.string().optional(),
});

export type FSOpenData = z.infer<typeof FSOpenDataSchema>;

export const FSOpenEventSchema = z
  .object({
    filePath: z.string().optional(),
  })
  .brand<'FileSystem/OpenEvent'>();

export type FSOpenEvent = z.infer<typeof FSOpenEventSchema>;

export const FSOpenPathDataSchema = z.object({
  browseTypes: z.array(z.string()).optional(),
  delegateId: z.string(),
  icon: z.string().optional(),
  message: z.string().optional(),
  title: z.string().optional(),
});

export type FSOpenPathData = z.infer<typeof FSOpenPathDataSchema>;

export const FSOpenPathEventSchema = z
  .object({
    filePath: z.string().optional(),
  })
  .brand<'FileSystem/OpenPathEvent'>();

export type FSOpenPathEvent = z.infer<typeof FSOpenPathEventSchema>;

export function registerFileSystem() {
  return {
    name: 'FileSystem',
    windows: {
      Open: {
        schema: FSOpenDataSchema,
        window: FileSystemOpenWindow,
      },
      OpenPath: {
        schema: FSOpenPathDataSchema,
        window: FileSystemOpenPathWindow,
      },
    },
  };
}
