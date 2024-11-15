export function Symbol(p: {
  symbol:
    | 'chevronDown'
    | 'chevronLeft'
    | 'chevronRight'
    | 'chevronUp'
    | 'help'
    | 'mediaNext'
    | 'mediaPause'
    | 'mediaPlay'
    | 'mediaPrevious'
    | 'mediaRepeat'
    | 'mediaShuffle'
    | 'mediaStop'
    | 'twitterLike'
    | 'twitterRetweet'
    | 'windowClose'
    | 'windowMaximize'
    | 'windowMinimize'
    | 'windowRestore';
}) {
  return (
    <svg class="Symbol">
      <use href={`#${p.symbol}`}></use>
    </svg>
  );
}
