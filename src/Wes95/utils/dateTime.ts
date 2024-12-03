const agoTimeFormatter = new Intl.RelativeTimeFormat('en', {
  numeric: 'always',
  style: 'narrow',
});

export function ago(date: string | Date) {
  date = date instanceof Date ? date : new Date(date);
  const now = Date.now();
  let diff = Math.round((date.getTime() - now) / 1000);
  let unit: Intl.RelativeTimeFormatUnit = 'second';

  if (diff < -60) {
    diff = Math.round(diff / 60);
    unit = 'minute';

    if (diff < -60) {
      diff = Math.round(diff / 60);
      unit = 'hour';

      if (diff < -24) {
        diff = Math.round(diff / 24);
        unit = 'day';

        if (diff < -7) {
          diff = Math.round(diff / 7);
          unit = 'week';
        }
      }
    }
  }

  return agoTimeFormatter.format(diff, unit).replace(' ago', '');
}

export function duration(secondsInit: number) {
  const hours = Math.floor(secondsInit / 3600);
  const minutes = Math.floor(secondsInit / 60);
  const seconds = Math.floor(secondsInit % 60);

  const result: string[] = [];
  if (hours) {
    result.push(hours.toString());
  }
  result.push(minutes.toString().padStart(2, '0'));
  result.push(seconds.toString().padStart(2, '0'));

  return result.join(':');
}
