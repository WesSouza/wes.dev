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
  icon: string;
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
