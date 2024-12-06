import { trpc } from '../../trpc/client';
import type { AstroContentEntry } from '../models/AstroContent';

let shared: FileSystemManager | undefined;

export type FileNode = Directory | File | Shortcut;

export type Directory = {
  type: 'directory';
  directory: string;
  name: string;
  path: string;
  url: string;
};

export type File = {
  type: 'file';
  directory: string;
  extension: string;
  name: string;
  path: string;
  url: string;
};

export type Shortcut = {
  type: 'shortcut';
  directory: string;
  name: string;
  path: string;
  url: string;
  icon: string;
};

const ExtensionMap: Record<string, string> = {
  m4a: 'wav',
  mp3: 'wav',
  png: 'bmp',
};

const virtualDirectories: Record<string, FileNode[]> = {
  '/Desktop': [
    makeDirectory('/My Computer'),
    makeShortcut(
      '/My Computer',
      'Internet Explorer',
      'app://InternetExplorer/Main',
      'iconIexplore',
    ),
    makeDirectory('/C/My Documents'),
    makeDirectory('/Recycle Bin'),
    makeShortcut(
      '/My Computer',
      'Bluesky',
      'app://Bluesky/Profile',
      'iconBluesky',
    ),
    makeShortcut(
      '/My Computer',
      'Welcome.doc',
      `apps://WordPad/Main?open=${encodeURIComponent('/C/My Documents/Welcome.doc')}`,
      'fileTypeWordPad',
    ),
  ],
  '/My Computer': [
    makeDirectory('/A'),
    makeDirectory('/C'),
    makeDirectory('/D'),
  ],
};

const hardcodedFiles = [
  '/C/My Documents/Photo.png',
  '/C/Wes95/Media/Chimes.mp3',
  '/C/Wes95/Media/Chord.mp3',
  '/C/Wes95/Media/Ding.mp3',
  '/C/Wes95/Media/Tada.mp3',
  '/C/Wes95/Media/TheMicrosoftSound.m4a',
];

function addDirectories(entries: Map<string, FileNode>) {
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
    name: path.match(/^\/[A-Z]$/) ? name + ':' : name,
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

function makeShortcut(
  directory: string,
  name: string,
  url: string,
  icon: string,
): Shortcut {
  return {
    type: 'shortcut',
    directory,
    name,
    path: directory + '/' + name,
    url,
    icon,
  };
}

export class FileSystemManager {
  static get shared() {
    if (!shared) {
      shared = new FileSystemManager();
    }

    return shared;
  }

  fileSystem = new Map<string, FileNode>();
  fileSystemReady: Promise<void>;

  constructor() {
    for (const hardcodedFile of hardcodedFiles) {
      const file = makeFile(hardcodedFile);
      this.fileSystem.set(file.path, file);
    }

    this.fileSystemReady = new Promise((resolve) => {
      trpc.wes95_fileSystem.getCollections
        .query({ types: ['blog', 'documents'] })
        .then((entries) => {
          if (!entries) {
            return;
          }

          for (const entry of entries) {
            const file = makeFileFromAstroContent(entry);
            this.fileSystem.set(file.path, file);
          }

          addDirectories(this.fileSystem);

          resolve();
        });
    });
  }

  getFile = async (path: string | undefined) => {
    await this.fileSystemReady;

    const file = this.fileSystem.get(path!);
    if (!file) {
      console.error(`Unable to find file ${path}`);
      return undefined;
    }

    return file;
  };

  getFileHandler = (_path: string | undefined) => {
    // TODO: Implement
    return undefined;
  };

  getFiles = async (path: string = '/C') => {
    await this.fileSystemReady;

    const files: FileNode[] = [];
    const startsWithPath = path + '/';

    for (const [filePath, file] of this.fileSystem) {
      if (
        !filePath.startsWith(startsWithPath) ||
        filePath.indexOf('/', startsWithPath.length) !== -1
      ) {
        continue;
      }
      files.push(file);
    }

    files.sort((left, right): number =>
      left.type === 'directory' && right.type === 'file'
        ? -1
        : left.type === 'file' && right.type === 'directory'
          ? 1
          : left.name.localeCompare(right.name),
    );

    if (virtualDirectories[path]) {
      return [...virtualDirectories[path], ...files];
    }

    return files;
  };

  readFile = async (path: string) => {
    const file = await this.getFile(path);
    if (!file) {
      return undefined;
    }

    const url = new URL(file.url);

    if (url.protocol === 'astro-content:') {
      return trpc.wes95_fileSystem.getEntry.query({
        // @ts-expect-error
        type: url.hostname,
        id: url.pathname.substring(1),
      });
    }

    return undefined;
  };
}
