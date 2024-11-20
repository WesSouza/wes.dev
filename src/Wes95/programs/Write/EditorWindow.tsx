import { createResource, createSignal, createUniqueId } from 'solid-js';
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

export const WriteEditorDataSchema = z.object({
  url: z.string().optional(),
});

export type WriteEditorData = z.infer<typeof WriteEditorDataSchema>;

export function WriteEditorWindow(p: {
  window: WindowState;
  data: WriteEditorData;
}) {
  const [url, setUrl] = createSignal(p.data.url);

  const [file] = createResource(url, FileSystemManager.shared.readFile);

  const openFile = () => {
    const delegateId = createUniqueId();
    WindowManager.shared.addWindow(
      FSOpenDataSchema,
      `system://FileSystem/Open?delegateId=${delegateId}`,
      {
        active: true,
        parentId: p.window.id,
      },
    );

    WindowManager.shared.handleOnce(
      delegateId,
      (event) => {
        setUrl(event.url);
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
        <button type="button" class="ToolbarButton" onClick={openFile}>
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
        <div class="Content MediumSpacing Document">
          <Markdown markdown={file()?.data?.body} />
        </div>
      </div>
    </>
  );
}
