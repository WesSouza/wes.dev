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
