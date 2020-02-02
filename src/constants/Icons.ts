export enum Icons {
  dialogError = 'dialogError',
  dialogQuestion = 'dialogQuestion',
  dialogWarning = 'dialogWarning',
  fileTypeBitmap = 'fileTypeBitmap',
  fileTypeBriefcase = 'fileTypeBriefcase',
  fileTypeExecutable = 'fileTypeExecutable',
  fileTypeGif = 'fileTypeGif',
  fileTypeJpeg = 'fileTypeJpeg',
  fileTypeMidi = 'fileTypeMidi',
  fileTypeText = 'fileTypeText',
  fileTypeUnknown = 'fileTypeUnknown',
  fileTypeWave = 'fileTypeWave',
  iconCalc = 'iconCalc',
  iconCD = 'iconCD',
  iconCharmap = 'iconCharmap',
  iconComputer = 'iconComputer',
  iconDefrag = 'iconDefrag',
  iconDesktop = 'iconDesktop',
  iconDial = 'iconDial',
  iconDocumentsFolder = 'iconDocumentsFolder',
  iconDos = 'iconDos',
  iconDrive = 'iconDrive',
  iconExplorer = 'iconExplorer',
  iconFind = 'iconFind',
  iconFloppy = 'iconFloppy',
  iconFolderClosed = 'iconFolderClosed',
  iconFolderOpen = 'iconFolderOpen',
  iconGeneric = 'iconGeneric',
  iconHelp = 'iconHelp',
  iconIexplorer = 'iconIexplorer',
  iconInstagram = 'iconInstagram',
  iconJdbmgr = 'iconJdbmgr',
  iconMail = 'iconMail',
  iconMinesweeper = 'iconMinesweeper',
  iconModem = 'iconModem',
  iconMplayer = 'iconMplayer',
  iconNetmeeting = 'iconNetmeeting',
  iconNetscape = 'iconNetscape',
  iconNotepad = 'iconNotepad',
  iconPaint = 'iconPaint',
  iconProgramsFolder = 'iconProgramsFolder',
  iconRun = 'iconRun',
  iconSemaphore = 'iconSemaphore',
  iconSettings = 'iconSettings',
  iconShutdown = 'iconShutdown',
  iconSolitaire = 'iconSolitaire',
  iconStart = 'iconStart',
  iconSuspend = 'iconSuspend',
  iconTrashEmpty = 'iconTrashEmpty',
  iconTrashFull = 'iconTrashFull',
  iconTwitter = 'iconTwitter',
  iconWebError = 'iconWebError',
  sysTraySound = 'sysTraySound',
}

export enum IconSizes {
  small = 'small',
  large = 'large',
}

export const IconSrcs: Record<Icons, Record<IconSizes, string>> = {
  [Icons.dialogError]: {
    [IconSizes.small]: require('../assets/dialogError.png'),
    [IconSizes.large]: require('../assets/dialogError.png'),
  },
  [Icons.dialogQuestion]: {
    [IconSizes.small]: require('../assets/dialogQuestion.png'),
    [IconSizes.large]: require('../assets/dialogQuestion.png'),
  },
  [Icons.dialogWarning]: {
    [IconSizes.small]: require('../assets/dialogWarning.png'),
    [IconSizes.large]: require('../assets/dialogWarning.png'),
  },
  [Icons.fileTypeBitmap]: {
    [IconSizes.small]: require('../assets/fileTypeBitmapSmall.png'),
    [IconSizes.large]: require('../assets/fileTypeBitmapLarge.png'),
  },
  [Icons.fileTypeBriefcase]: {
    [IconSizes.small]: require('../assets/fileTypeBriefcaseLarge.png'),
    [IconSizes.large]: require('../assets/fileTypeBriefcaseLarge.png'),
  },
  [Icons.fileTypeExecutable]: {
    [IconSizes.small]: require('../assets/fileTypeExecutableSmall.png'),
    [IconSizes.large]: require('../assets/fileTypeExecutableLarge.png'),
  },
  [Icons.fileTypeGif]: {
    [IconSizes.small]: require('../assets/fileTypeGifSmall.png'),
    [IconSizes.large]: require('../assets/fileTypeGifLarge.png'),
  },
  [Icons.fileTypeJpeg]: {
    [IconSizes.small]: require('../assets/fileTypeJpegSmall.png'),
    [IconSizes.large]: require('../assets/fileTypeJpegLarge.png'),
  },
  [Icons.fileTypeMidi]: {
    [IconSizes.small]: require('../assets/fileTypeMidiSmall.png'),
    [IconSizes.large]: require('../assets/fileTypeMidiLarge.png'),
  },
  [Icons.fileTypeText]: {
    [IconSizes.small]: require('../assets/fileTypeTextSmall.png'),
    [IconSizes.large]: require('../assets/fileTypeTextLarge.png'),
  },
  [Icons.fileTypeUnknown]: {
    [IconSizes.small]: require('../assets/fileTypeUnknownSmall.png'),
    [IconSizes.large]: require('../assets/fileTypeUnknownLarge.png'),
  },
  [Icons.fileTypeWave]: {
    [IconSizes.small]: require('../assets/fileTypeWaveSmall.png'),
    [IconSizes.large]: require('../assets/fileTypeWaveLarge.png'),
  },
  [Icons.iconCalc]: {
    [IconSizes.small]: require('../assets/iconCalcSmall.png'),
    [IconSizes.large]: require('../assets/iconCalcLarge.png'),
  },
  [Icons.iconCD]: {
    [IconSizes.small]: require('../assets/iconCDSmall.png'),
    [IconSizes.large]: require('../assets/iconCDLarge.png'),
  },
  [Icons.iconCharmap]: {
    [IconSizes.small]: require('../assets/iconCharmapSmall.png'),
    [IconSizes.large]: require('../assets/iconCharmapSmall.png'),
  },
  [Icons.iconComputer]: {
    [IconSizes.small]: require('../assets/iconComputerSmall.png'),
    [IconSizes.large]: require('../assets/iconComputerLarge.png'),
  },
  [Icons.iconDefrag]: {
    [IconSizes.small]: require('../assets/iconDefragSmall.png'),
    [IconSizes.large]: require('../assets/iconDefragLarge.png'),
  },
  [Icons.iconDesktop]: {
    [IconSizes.small]: require('../assets/iconDesktopSmall.png'),
    [IconSizes.large]: require('../assets/iconDesktopLarge.png'),
  },
  [Icons.iconDial]: {
    [IconSizes.small]: require('../assets/iconDialLarge.png'),
    [IconSizes.large]: require('../assets/iconDialLarge.png'),
  },
  [Icons.iconDocumentsFolder]: {
    [IconSizes.small]: require('../assets/iconDocumentsFolderSmall.png'),
    [IconSizes.large]: require('../assets/iconDocumentsFolderLarge.png'),
  },
  [Icons.iconDos]: {
    [IconSizes.small]: require('../assets/iconDosSmall.png'),
    [IconSizes.large]: require('../assets/iconDosSmall.png'),
  },
  [Icons.iconDrive]: {
    [IconSizes.small]: require('../assets/iconDriveSmall.png'),
    [IconSizes.large]: require('../assets/iconDriveLarge.png'),
  },
  [Icons.iconExplorer]: {
    [IconSizes.small]: require('../assets/iconExplorerSmall.png'),
    [IconSizes.large]: require('../assets/iconExplorerLarge.png'),
  },
  [Icons.iconFind]: {
    [IconSizes.small]: require('../assets/iconFindSmall.png'),
    [IconSizes.large]: require('../assets/iconFindLarge.png'),
  },
  [Icons.iconFloppy]: {
    [IconSizes.small]: require('../assets/iconFloppySmall.png'),
    [IconSizes.large]: require('../assets/iconFloppyLarge.png'),
  },
  [Icons.iconFolderClosed]: {
    [IconSizes.small]: require('../assets/iconFolderClosedSmall.png'),
    [IconSizes.large]: require('../assets/iconFolderClosedLarge.png'),
  },
  [Icons.iconFolderOpen]: {
    [IconSizes.small]: require('../assets/iconFolderOpenSmall.png'),
    [IconSizes.large]: require('../assets/iconFolderOpenLarge.png'),
  },
  [Icons.iconGeneric]: {
    [IconSizes.small]: require('../assets/iconGenericSmall.png'),
    [IconSizes.large]: require('../assets/iconGenericLarge.png'),
  },
  [Icons.iconHelp]: {
    [IconSizes.small]: require('../assets/iconHelpSmall.png'),
    [IconSizes.large]: require('../assets/iconHelpLarge.png'),
  },
  [Icons.iconIexplorer]: {
    [IconSizes.small]: require('../assets/iconIexplorerSmall.png'),
    [IconSizes.large]: require('../assets/iconIexplorerLarge.png'),
  },
  [Icons.iconInstagram]: {
    [IconSizes.small]: require('../assets/iconInstagramSmall.png'),
    [IconSizes.large]: require('../assets/iconInstagramSmall.png'),
  },
  [Icons.iconJdbmgr]: {
    [IconSizes.small]: require('../assets/iconJdbmgrLarge.png'),
    [IconSizes.large]: require('../assets/iconJdbmgrLarge.png'),
  },
  [Icons.iconMail]: {
    [IconSizes.small]: require('../assets/iconMailSmall.png'),
    [IconSizes.large]: require('../assets/iconMailLarge.png'),
  },
  [Icons.iconMinesweeper]: {
    [IconSizes.small]: require('../assets/iconMinesweeperSmall.png'),
    [IconSizes.large]: require('../assets/iconMinesweeperSmall.png'),
  },
  [Icons.iconModem]: {
    [IconSizes.small]: require('../assets/iconModemSmall.png'),
    [IconSizes.large]: require('../assets/iconModemLarge.png'),
  },
  [Icons.iconMplayer]: {
    [IconSizes.small]: require('../assets/iconMplayerSmall.png'),
    [IconSizes.large]: require('../assets/iconMplayerLarge.png'),
  },
  [Icons.iconNetmeeting]: {
    [IconSizes.small]: require('../assets/iconNetmeetingSmall.png'),
    [IconSizes.large]: require('../assets/iconNetmeetingSmall.png'),
  },
  [Icons.iconNetscape]: {
    [IconSizes.small]: require('../assets/iconNetscapeSmall.png'),
    [IconSizes.large]: require('../assets/iconNetscapeLarge.png'),
  },
  [Icons.iconNotepad]: {
    [IconSizes.small]: require('../assets/iconNotepadSmall.png'),
    [IconSizes.large]: require('../assets/iconNotepadLarge.png'),
  },
  [Icons.iconPaint]: {
    [IconSizes.small]: require('../assets/iconPaintSmall.png'),
    [IconSizes.large]: require('../assets/iconPaintLarge.png'),
  },
  [Icons.iconProgramsFolder]: {
    [IconSizes.small]: require('../assets/iconProgramsFolderSmall.png'),
    [IconSizes.large]: require('../assets/iconProgramsFolderLarge.png'),
  },
  [Icons.iconRun]: {
    [IconSizes.small]: require('../assets/iconRunSmall.png'),
    [IconSizes.large]: require('../assets/iconRunLarge.png'),
  },
  [Icons.iconSemaphore]: {
    [IconSizes.small]: require('../assets/iconSemaphoreSmall.png'),
    [IconSizes.large]: require('../assets/iconSemaphoreLarge.png'),
  },
  [Icons.iconSettings]: {
    [IconSizes.small]: require('../assets/iconSettingsSmall.png'),
    [IconSizes.large]: require('../assets/iconSettingsLarge.png'),
  },
  [Icons.iconShutdown]: {
    [IconSizes.small]: require('../assets/iconShutdownSmall.png'),
    [IconSizes.large]: require('../assets/iconShutdownLarge.png'),
  },
  [Icons.iconSolitaire]: {
    [IconSizes.small]: require('../assets/iconSolitaireSmall.png'),
    [IconSizes.large]: require('../assets/iconSolitaireSmall.png'),
  },
  [Icons.iconStart]: {
    [IconSizes.small]: require('../assets/iconStartSmall.png'),
    [IconSizes.large]: require('../assets/iconStartSmall.png'),
  },
  [Icons.iconSuspend]: {
    [IconSizes.small]: require('../assets/iconSuspendSmall.png'),
    [IconSizes.large]: require('../assets/iconSuspendLarge.png'),
  },
  [Icons.iconTrashEmpty]: {
    [IconSizes.small]: require('../assets/iconTrashEmptySmall.png'),
    [IconSizes.large]: require('../assets/iconTrashEmptyLarge.png'),
  },
  [Icons.iconTrashFull]: {
    [IconSizes.small]: require('../assets/iconTrashFullSmall.png'),
    [IconSizes.large]: require('../assets/iconTrashFullLarge.png'),
  },
  [Icons.iconTwitter]: {
    [IconSizes.small]: require('../assets/iconTwitterSmall.png'),
    [IconSizes.large]: require('../assets/iconTwitterSmall.png'),
  },
  [Icons.iconWebError]: {
    [IconSizes.small]: require('../assets/iconWebErrorLarge.png'),
    [IconSizes.large]: require('../assets/iconWebErrorLarge.png'),
  },
  [Icons.sysTraySound]: {
    [IconSizes.small]: require('../assets/sysTraySoundSmall.png'),
    [IconSizes.large]: require('../assets/sysTraySoundSmall.png'),
  },
};
