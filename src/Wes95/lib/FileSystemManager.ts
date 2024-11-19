import { actions } from 'astro:actions';
import type { AstroContentEntry } from '../models/AstroContent';

let shared: FileSystemManager | undefined;

export type File = {
  type: 'file';
  directory: string;
  extension: string;
  name: string;
  path: string;
  url: string;
};

export type Directory = {
  type: 'directory';
  directory: string;
  name: string;
  path: string;
  url: string;
};

const ExtensionMap: Record<string, string> = {
  m4a: 'wav',
  mp3: 'wav',
  png: 'bmp',
};

function addDirectories(entries: Map<string, File | Directory>) {
  for (const [, item] of entries) {
    let currentDirectory = item.directory;
    while (
      !entries.has(currentDirectory) &&
      currentDirectory &&
      currentDirectory !== '/'
    ) {
      const directory = makeDirectory(currentDirectory);
      entries.set(currentDirectory, directory);

      currentDirectory = currentDirectory.replace(/\/[^/]+$/, '');
    }
  }
}

function makeDirectory(path: string): Directory {
  const lastSlashIndex = path.lastIndexOf('/');
  const directory = path.substring(0, lastSlashIndex);
  const name = path.substring(lastSlashIndex + 1);
  const url = `file://${path}`;

  return {
    type: 'directory',
    directory,
    name,
    path,
    url,
  };
}

function makeFile(path: string): File {
  const lastSlashIndex = path.lastIndexOf('/');
  const lastDotIndex = path.lastIndexOf('.');
  const directory = path.substring(0, lastSlashIndex);
  const realExtension = path.substring(lastDotIndex + 1);
  const extension = ExtensionMap[realExtension] ?? realExtension;
  const name = path.substring(lastSlashIndex + 1, lastDotIndex);
  const url = `file://${path}`;

  return {
    type: 'file',
    directory,
    extension,
    name: `${name}.${extension}`,
    path,
    url,
  };
}

function makeFileFromAstroContent(entry: AstroContentEntry): File {
  const path = entry.data.wes95_file;
  const lastSlashIndex = path.lastIndexOf('/');
  const lastDotIndex = path.lastIndexOf('.');
  const directory = path.substring(0, lastSlashIndex);
  const extension = path.substring(lastDotIndex + 1);
  const name = path.substring(lastSlashIndex + 1, lastDotIndex);
  const url = `astro-content://${entry.collection}/${entry.slug}`;

  return {
    type: 'file',
    directory,
    extension,
    name: `${name}.${extension}`,
    path,
    url,
  };
}

export class FileSystemManager {
  static get shared() {
    if (!shared) {
      shared = new FileSystemManager();
    }

    return shared;
  }

  hardcodedFiles = [
    '/C/My_Documents/Photo.png',
    '/C/Wes95/Media/Chimes.mp3',
    '/C/Wes95/Media/Chord.mp3',
    '/C/Wes95/Media/Ding.mp3',
    '/C/Wes95/Media/Tada.mp3',
    '/C/Wes95/Media/TheMicrosoftSound.m4a',
  ];

  fileSystem = new Map<string, Directory | File>();

  constructor() {
    for (const hardcodedFile of this.hardcodedFiles) {
      const file = makeFile(hardcodedFile);
      this.fileSystem.set(file.path, file);
    }

    actions.getCollections({ types: ['blog', 'documents'] }).then((entries) => {
      if (!entries.data) {
        return;
      }

      for (const entry of entries.data) {
        const file = makeFileFromAstroContent(entry);
        this.fileSystem.set(file.path, file);
      }

      addDirectories(this.fileSystem);
    });
  }

  async readFile(fileUrl: string) {
    const url = new URL(fileUrl);

    if (url.protocol === 'astro-content:') {
      return actions.getEntry({
        // @ts-expect-error
        type: url.hostname,
        id: url.pathname.substring(1),
      });
    }

    return undefined;
  }
}