import type { Directory, File } from '../lib/FileSystemManager';

const FileTypesMap = [
  {
    id: 'bitmap',
    name: 'Bitmap',
    icon: 'Bitmap',
    test: /\.(bmp)$/i,
  },
  {
    id: 'document',
    name: 'WordPad Document',
    icon: 'WordPad',
    test: /\.(doc|rtf|wri)$/i,
  },
  {
    id: 'executable',
    name: 'Executable',
    icon: 'Executable',
    test: /\.(com|exe)$/i,
  },
  {
    id: 'gif',
    name: 'GIF',
    icon: 'Gif',
    test: /\.(gif)$/i,
  },
  {
    id: 'html',
    name: 'HTML Document',
    icon: 'Html',
    test: /\.(html?)$/i,
  },
  {
    id: 'jpeg',
    name: 'JPEG Image',
    icon: 'Jpeg',
    test: /\.(jpe?g)$/i,
  },
  {
    id: 'midi',
    name: 'Midi Song',
    icon: 'Midi',
    test: /\.(mid)$/i,
  },
  {
    id: 'text',
    name: 'Text Document',
    icon: 'Text',
    test: /\.(txt)$/i,
  },
  {
    id: 'wave',
    name: 'Wave Sound',
    icon: 'Wave',
    test: /\.(m4a|mp3|wav)$/i,
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

export function filterFileTypes(fileTypeIds: string[] | undefined) {
  if (
    !fileTypeIds ||
    !fileTypeIds.length ||
    (fileTypeIds.length === 1 && fileTypeIds[0] === 'all')
  ) {
    return () => true;
  }

  const fileTypeTests = FileTypesMap.filter((fileType) =>
    fileTypeIds.includes(fileType.id),
  );
  return (file: File | Directory) =>
    file.type === 'directory' ||
    fileTypeTests.some((fileType) => fileType.test.test(file.path));
}
