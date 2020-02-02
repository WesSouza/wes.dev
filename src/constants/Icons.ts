export enum Icons {
  fileTypeText,
}

export enum IconSizes {
  small,
  large,
}

export const IconSrcs = {
  [Icons.fileTypeText]: {
    [IconSizes.small]: require('../assets/fileTypeTextSmall.png'),
    [IconSizes.large]: require('../assets/fileTypeTextLarge.png'),
  },
};
