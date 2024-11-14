import { WES95_SYSTEM_PATH } from '../../config';

const IconSizes = {
  small: {
    width: 32,
    height: 32,
    suffix: 'Small',
  },
  large: {
    width: 64,
    height: 64,
    suffix: 'Large',
  },
};

export function Icon(p: {
  icon:
    | 'dialog'
    | 'fileTypeBitmap'
    | 'fileTypeBriefcase'
    | 'fileTypeExecutable'
    | 'fileTypeGif'
    | 'fileTypeHtml'
    | 'fileTypeJpeg'
    | 'fileTypeMidi'
    | 'fileTypeText'
    | 'fileTypeUnknown'
    | 'fileTypeWave'
    | 'iconCD'
    | 'iconCalc'
    | 'iconCharmap'
    | 'iconComputer'
    | 'iconDefrag'
    | 'iconDesktop'
    | 'iconDial'
    | 'iconDocumentsFolder'
    | 'iconDos'
    | 'iconDrive'
    | 'iconExplorer'
    | 'iconFind'
    | 'iconFloppy'
    | 'iconFolderClosed'
    | 'iconFolderOpen'
    | 'iconGeneric'
    | 'iconHelp'
    | 'iconIexplorer'
    | 'iconInstagram'
    | 'iconJdbmgr'
    | 'iconMail'
    | 'iconMinesweeper'
    | 'iconModem'
    | 'iconMplayer'
    | 'iconNetmeeting'
    | 'iconNetscape'
    | 'iconNettalk'
    | 'iconNotepad'
    | 'iconPaint'
    | 'iconProgramsFolder'
    | 'iconRun'
    | 'iconSemaphore'
    | 'iconSettings'
    | 'iconShutdown'
    | 'iconSolitaire'
    | 'iconSuspend'
    | 'iconTrashEmpty'
    | 'iconTrashFull'
    | 'iconTwitter'
    | 'iconWebError'
    | 'iconWes'
    | 'sysTraySound'
    | 'toolbarCopy'
    | 'toolbarCut'
    | 'toolbarFavoriteAdd'
    | 'toolbarFavorites'
    | 'toolbarFontDecrease'
    | 'toolbarFontIncrease'
    | 'toolbarHome'
    | 'toolbarOpen'
    | 'toolbarPaste'
    | 'toolbarReload'
    | 'toolbarStop'
    | string;
  size?: 'small' | 'large' | undefined;
}) {
  return (
    <img
      class="Icon"
      width={IconSizes[p.size ?? 'small'].width}
      height={IconSizes[p.size ?? 'small'].height}
      src={
        WES95_SYSTEM_PATH +
        '/' +
        p.icon +
        IconSizes[p.size ?? 'small'].suffix +
        '.png'
      }
    />
  );
}
