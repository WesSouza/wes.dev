export function Symbol(p: {
  symbol:
    | 'checkmark'
    | 'chevronDown'
    | 'chevronLeft'
    | 'chevronRight'
    | 'chevronUp'
    | 'help'
    | 'like'
    | 'mediaNext'
    | 'mediaPause'
    | 'mediaPlay'
    | 'mediaPrevious'
    | 'mediaRepeat'
    | 'mediaShuffle'
    | 'mediaStop'
    | 'radio'
    | 'retweet'
    | 'windowClose'
    | 'windowMaximize'
    | 'windowMinimize'
    | 'windowRestore';
}) {
  return (
    <svg class="Symbol" viewBox="0 0 18 18">
      <use href={`#${p.symbol}`}></use>
    </svg>
  );
}
