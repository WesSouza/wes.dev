import { WES95_SYSTEM_PATH } from '../../config';

const IconSizes = {
  small: {
    suffix: 'Small',
  },
  medium: {
    suffix: 'Medium',
  },
  large: {
    suffix: 'Large',
  },
};

export function Icon(p: { icon: string; size?: 'small' | 'medium' | 'large' }) {
  return (
    <img
      classList={{
        Icon: true,
        '-medium': p.size === 'medium',
        '-large': p.size === 'large',
      }}
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
