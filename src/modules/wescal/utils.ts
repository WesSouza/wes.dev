import { Temporal } from 'temporal-polyfill';
import type {
  CalendarDayMeta,
  DateTimeInterval,
  PlainTimeInterval,
} from './schema';

export function sortIntervals(left: DateTimeInterval, right: DateTimeInterval) {
  const fromSort = Temporal.ZonedDateTime.compare(left.from, right.from);
  if (fromSort !== 0) {
    return fromSort;
  }
  return Temporal.ZonedDateTime.compare(left.until, right.until);
}

export function createCalendarGridData(options: {
  freeTimeByWeekday: Record<number, PlainTimeInterval>;
  maxDaysFromToday: number;
  startingAtWeekday?: number | undefined;
  today?: Temporal.ZonedDateTime | undefined;
}): {
  days: CalendarDayMeta[];
  hourLabels: string[];
  overallInterval: PlainTimeInterval;
  today: Temporal.ZonedDateTime;
} {
  const {
    freeTimeByWeekday,
    maxDaysFromToday,
    startingAtWeekday = 0,
    today = Temporal.Now.zonedDateTimeISO(),
  } = options;

  const timeFormatter = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
  });

  const dayFormatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    day: 'numeric',
  });

  const minHour = Object.values(freeTimeByWeekday).reduce(
    (previous, freeHours) => Math.min(freeHours.from.hour, previous),
    24,
  );

  const maxHour = Object.values(freeTimeByWeekday).reduce(
    (previous, freeHours) => Math.max(freeHours.until.hour, previous),
    0,
  );

  const hourLabels = Array.from({ length: maxHour - minHour + 1 }, (_, index) =>
    timeFormatter.format(new Date(2000, 0, 1, minHour + index, 0, 0)),
  );

  const overallInterval = {
    from: Temporal.PlainTime.from({ hour: minHour, minute: 0, second: 0 }),
    until: Temporal.PlainTime.from({ hour: maxHour, minute: 59, second: 59 }),
  };

  const days = createWeekDays({
    maxDaysFromToday,
    startingAtWeekday,
    today,
  }).map((date) => ({
    availableFrom: freeTimeByWeekday[date.dayOfWeek]?.from,
    availableUntil: freeTimeByWeekday[date.dayOfWeek]?.until,
    day: date,
    disabled: date < today.toPlainDate(),
    label: dayFormatter.format(
      date.toZonedDateTime({
        plainTime: '00:00:00',
        timeZone: today.timeZone,
      }).epochMilliseconds,
    ),
    weekend: (date.dayOfWeek - 1) % 6 === 0,
  }));

  return { days, hourLabels, overallInterval, today };
}

export function createUnavailableIntervals({
  freeTimeByWeekday,
  from,
  timeZone,
  until,
}: {
  freeTimeByWeekday: Record<number, PlainTimeInterval>;
  from: Temporal.PlainDate;
  timeZone: Temporal.TimeZone;
  until: Temporal.PlainDate;
}): DateTimeInterval[] {
  const unavailableTimes: DateTimeInterval[] = [];

  let date = from;
  while (date <= until) {
    const weekday = date.dayOfWeek;
    const freeTime = freeTimeByWeekday[weekday];

    if (!freeTime) {
      unavailableTimes.push({
        from: date.toPlainDateTime('00:00:00').toZonedDateTime(timeZone),
        until: date.toPlainDateTime('23:59:59').toZonedDateTime(timeZone),
      });
      continue;
    }

    if (!freeTime.from.equals('00:00:00')) {
      unavailableTimes.push({
        from: date.toZonedDateTime({ timeZone, plainTime: '00:00:00' }),
        until: freeTime.from.toZonedDateTime({ timeZone, plainDate: date }),
      });
    }
    if (!freeTime.from.equals('23:59:59')) {
      unavailableTimes.push({
        from: freeTime.until.toZonedDateTime({ timeZone, plainDate: date }),
        until: date.toZonedDateTime({ timeZone, plainTime: '23:59:59' }),
      });
    }

    date = date.add({ days: 1 });
  }

  return unavailableTimes;
}

export function createWeekDays(options: {
  maxDaysFromToday: number;
  startingAtWeekday: number;
  today: Temporal.ZonedDateTime;
}): Temporal.PlainDate[] {
  const { maxDaysFromToday, startingAtWeekday, today } = options;
  const subtractFromToday = today.dayOfWeek - 1;
  const addToToday = startingAtWeekday;
  const addToLastDay =
    maxDaysFromToday - today.dayOfWeek - startingAtWeekday - 7;

  let date = today.toPlainDate();
  if (subtractFromToday > 0) {
    date = date.subtract({ days: subtractFromToday });
  }
  if (addToToday > 0) {
    date = date.add({ days: addToToday });
  }

  let lastDay = today.toPlainDate();
  if (addToLastDay > 0) {
    lastDay = lastDay.add({ days: addToLastDay });
  }

  const days: Temporal.PlainDate[] = [];
  while (date < lastDay) {
    days.push(date);
    date = date.add({ days: 1 });
  }

  return days;
}

export function sliceIntervalsByDay(intervals: DateTimeInterval[]) {
  const resultIntervals: DateTimeInterval[] = [];
  intervals.forEach((interval) => {
    if (interval.from.toPlainDate().equals(interval.until.toPlainDate())) {
      resultIntervals.push(interval);
      return;
    }

    resultIntervals.push({
      from: interval.from,
      until: interval.from.withPlainTime('23:59:59'),
    });

    const inBetweenDays = interval.until
      .until(interval.from)
      .round({ largestUnit: 'day', smallestUnit: 'day' }).days;
    for (let index = 1; index < inBetweenDays; index++) {
      const from = interval.from
        .toPlainDate()
        .add({ days: index })
        .toZonedDateTime({
          plainTime: '00:00:00',
          timeZone: interval.from.timeZone,
        });
      const until = from.withPlainTime('23:59:59');

      resultIntervals.push({
        from,
        until,
      });
    }

    resultIntervals.push({
      from: interval.until.withPlainTime('00:00:00'),
      until: interval.until,
    });
  });

  return resultIntervals;
}

export function mergeIntervals(
  intervals: DateTimeInterval[],
): DateTimeInterval[] {
  const mergedIntervals: DateTimeInterval[] = [];

  structuredClone(intervals)
    // Sort busy times by from then until
    .sort(sortIntervals)
    // For each possible busy interval, do this monstrosity
    .forEach((interval) => {
      // Find the index of the free interval that intersects with the beginning of the busy time
      const leftIndex = mergedIntervals.findIndex(
        (mergedInterval) =>
          interval.from >= mergedInterval.from &&
          interval.from <= mergedInterval.until,
      );

      // Find the index of the free interval that intersects with the end of the busy time
      const rightIndex = mergedIntervals.findLastIndex(
        (mergedInterval) =>
          interval.until >= mergedInterval.until &&
          interval.until <= mergedInterval.from,
      );

      // Find the actual free intervals
      const leftInterval = mergedIntervals[leftIndex];
      const rightInterval = mergedIntervals[rightIndex];

      // If those intersections are not found, add the interval and continue
      if (!leftInterval && !rightInterval) {
        mergedIntervals.push(interval);
        return;
      }

      // If both sides are the same, the event overlaps entirely with another event, therefore skip
      if (leftInterval === rightInterval) {
        return;
      }

      // Update the left interval to start at the current interval
      if (leftInterval && !rightInterval) {
        leftInterval.until =
          leftInterval.until > interval.until
            ? leftInterval.until
            : interval.until;
      }

      // Update the right interval to end at the current interval
      else if (!leftInterval && rightInterval) {
        rightInterval.from =
          rightInterval.from < interval.from
            ? rightInterval.from
            : interval.from;
      }

      // If different intervals intersections were found, merge them
      else if (leftInterval && rightInterval) {
        leftInterval.until = rightInterval.until;

        // Delete everything between left interval and right interval, including the right interval
        mergedIntervals.splice(rightIndex, rightIndex - leftIndex);
      }
    });

  return mergedIntervals;
}
