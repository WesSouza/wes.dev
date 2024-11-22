import {
  createEffect,
  createResource,
  createSignal,
  createUniqueId,
} from 'solid-js';
import { z } from 'zod';
import { Icon } from '../../components/Icon';
import { Markdown } from '../../components/Markdown';
import { FileSystemManager } from '../../lib/FileSystemManager';
import { WindowManager } from '../../lib/WindowManager';
import type { WindowState } from '../../models/WindowState';
import {
  FSOpenDataSchema,
  FSOpenEventSchema,
} from '../../system/FileSystem/OpenWindow';
import { createWindowURL } from '../../utils/Windows';

export const WordPadMainDataSchema = z.object({
  openFile: z.string().optional(),
});

export type WordPadMainData = z.infer<typeof WordPadMainDataSchema>;

export function WordPadMainWindow(p: {
  window: WindowState;
  data: WordPadMainData;
}) {
  let contentElement!: HTMLDivElement;
  const fileSystem = FileSystemManager.shared;
  const [openFilePath, setOpenFilePath] = createSignal(p.data.openFile);

  const [file] = createResource(openFilePath, fileSystem.getFile);
  const [fileData] = createResource(openFilePath, fileSystem.readFile);

  createEffect(() => {
    WindowManager.shared.setWindow(p.window.id, (window) => {
      window.title = `${file()?.name ?? 'Untitled'} - WordPad`;
      window.icon = 'iconWordPad';
    });
  });

  const openFileDialog = () => {
    const delegateId = createUniqueId();
    WindowManager.shared.addWindow(
      FSOpenDataSchema,
      createWindowURL('system://FileSystem/Open', {
        delegateId,
        fileTypes: ['document'],
      }),
      {
        active: true,
        parentId: p.window.id,
      },
    );

    WindowManager.shared.handleOnce(
      delegateId,
      (event) => {
        if (event.filePath) {
          setOpenFilePath(event.filePath);
          contentElement.scrollTo(0, 0);
        }
        WindowManager.shared.setActiveWindow(p.window);
      },
      FSOpenEventSchema,
    );
  };

  return (
    <>
      <div class="Toolbar Horizontal">
        <button type="button" class="ToolbarButton">
          <Icon icon="toolbarFileNew" />
        </button>
        <button type="button" class="ToolbarButton" onClick={openFileDialog}>
          <Icon icon="toolbarOpenFolder" />
        </button>
        <button type="button" class="ToolbarButton">
          <Icon icon="toolbarSave" />
        </button>
        <div class="MediumSpacer"></div>
        <button type="button" class="ToolbarButton">
          <Icon icon="toolbarFind" />
        </button>
        <div class="MediumSpacer"></div>
        <button type="button" class="ToolbarButton">
          <Icon icon="toolbarCut" />
        </button>
        <button type="button" class="ToolbarButton">
          <Icon icon="toolbarCopy" />
        </button>
        <button type="button" class="ToolbarButton">
          <Icon icon="toolbarPaste" />
        </button>
        <button type="button" class="ToolbarButton">
          <Icon icon="toolbarUndo" />
        </button>
      </div>
      <hr class="HorizontalSeparator" />
      <div class="Toolbar Horizontal">
        <button type="button" class="ToolbarButton">
          <Icon icon="toolbarBold" />
        </button>
        <button type="button" class="ToolbarButton">
          <Icon icon="toolbarItalics" />
        </button>
        <button type="button" class="ToolbarButton">
          <Icon icon="toolbarUnderline" />
        </button>
        <button type="button" class="ToolbarButton">
          <Icon icon="toolbarTextColor" />
        </button>
        <div class="MediumSpacer"></div>
        <button type="button" class="ToolbarButton">
          <Icon icon="toolbarAlignLeft" />
        </button>
        <button type="button" class="ToolbarButton">
          <Icon icon="toolbarAlignCenter" />
        </button>
        <button type="button" class="ToolbarButton">
          <Icon icon="toolbarAlignRight" />
        </button>
        <div class="MediumSpacer"></div>
        <button type="button" class="ToolbarButton">
          <Icon icon="toolbarUnorderedList" />
        </button>
      </div>
      <hr class="HorizontalSeparator" />
      <div class="Field">
        <div class="Content MediumSpacing Document" ref={contentElement}>
          <Markdown markdown={fileData()?.data?.body} />
        </div>
      </div>
    </>
  );
}
