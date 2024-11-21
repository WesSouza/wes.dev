import type { Directory, File } from '../lib/FileSystemManager';

const FileTypesMap = [
  {
    name: 'Bitmap',
    icon: 'Bitmap',
    test: /\.(bmp)$/i,
  },
  {
    name: 'Executable',
    icon: 'Executable',
    test: /\.(com|exe)$/i,
  },
  {
    name: 'GIF',
    icon: 'Gif',
    test: /\.(gif)$/i,
  },
  {
    name: 'HTML Document',
    icon: 'Html',
    test: /\.(html?)$/i,
  },
  {
    name: 'JPEG Image',
    icon: 'Jpeg',
    test: /\.(jpe?g)$/i,
  },
  {
    name: 'Midi Song',
    icon: 'Midi',
    test: /\.(mid)$/i,
  },
  {
    name: 'Text Document',
    icon: 'Text',
    test: /\.(txt)$/i,
  },
  {
    name: 'Wave Sound',
    icon: 'Wave',
    test: /\.(m4a|mp3|wav)$/i,
  },
  {
    name: 'Write Document',
    icon: 'Write',
    test: /\.(doc|rtf|wri)$/i,
  },
];

export function mapFileType(file: File | Directory) {
  if (file.type === 'directory') {
    return { name: 'Folder', icon: 'iconFolderClosed' };
  } else {
    for (const type of FileTypesMap) {
      if (type.test.test(file.name)) {
        return {
          name: type.name,
          icon: `fileType${type.icon}`,
        };
      }
    }
  }

  return { name: 'Unknown', icon: 'fileTypeUnknown' };
}
