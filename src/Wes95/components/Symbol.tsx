import { createMemo } from 'solid-js';

export function Symbol(p: {
  symbol:
    | 'checkmark'
    | 'chevronDown'
    | 'chevronLeft'
    | 'chevronRight'
    | 'chevronUp'
    | 'comment'
    | 'help'
    | 'like'
    | 'mediaFastForward'
    | 'mediaPause'
    | 'mediaPlay'
    | 'mediaRewind'
    | 'mediaSkipBack'
    | 'mediaSkipForward'
    | 'mediaStop'
    | 'radio'
    | 'repost'
    | 'windowClose'
    | 'windowMaximize'
    | 'windowMinimize'
    | 'windowRestore';
}) {
  const size = createMemo(() => (p.symbol.startsWith('media') ? 17 : 18));
  return (
    <svg class="Symbol" viewBox={`0 0 ${size()} ${size()}`}>
      <use href={`#${p.symbol}`}></use>
    </svg>
  );
}
