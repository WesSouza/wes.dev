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
    <div
      classList={{
        Icon: true,
        [`Icon_${p.icon + IconSizes[p.size ?? 'small'].suffix}`]: true,
      }}
    ></div>
  );
}
