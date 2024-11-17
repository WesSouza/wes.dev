import { WindowManager } from '@/Wes95/lib/WindowManager';
import { EditorDataSchema } from './EditorWindow';

export class NotepadProgram {
  windowManager = WindowManager.shared;

  main(args: { file?: string | undefined }) {
    const url = new URL('app://Notepad/Editor');
    if (args.file) url.searchParams.set('file', args.file);

    this.windowManager.addWindow(EditorDataSchema, url.toString(), {
      showInTaskbar: true,
      title: 'Notepad',
      icon: 'fileTypeText',
    });
  }
}
