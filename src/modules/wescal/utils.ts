import { Temporal } from '@js-temporal/polyfill';

import type {
  CalendarDayMeta,
  DateTimeInterval,
  PlainDateInterval,
  PlainTimeInterval,
} from './schema';

export function sortIntervals(left: DateTimeInterval, right: DateTimeInterval) {
  const fromSort = Temporal.ZonedDateTime.compare(left.from, right.from);
  if (fromSort !== 0) {
    return fromSort;
  }
  return Temporal.ZonedDateTime.compare(left.until, right.until);
}

export function getFirstAndLastCalendarDays({
  maxDaysFromToday,
  startingAtWeekday,
  today,
}: {
  maxDaysFromToday: number;
  startingAtWeekday: number;
  today: Temporal.ZonedDateTime;
}) {
  const firstDay = today
    .toPlainDate()
    .subtract({ days: today.dayOfWeek - 1 })
    .add({ days: startingAtWeekday });

  const lastDay = today
    .toPlainDate()
    .add({ days: maxDaysFromToday + 8 - today.dayOfWeek - startingAtWeekday });

  return { firstDay, lastDay };
}

export function createCalendarGridData(options: {
  freeTimeByWeekday: Record<number, PlainTimeInterval>;
  maxDaysFromToday: number;
  startingAtWeekday?: number | undefined;
  today?: Temporal.ZonedDateTime | undefined;
}): {
  calendarInterval: PlainDateInterval;
  days: CalendarDayMeta[];
  hourLabels: string[];
  overallInterval: PlainTimeInterval;
  today: Temporal.ZonedDateTime;
  visibleInterval: DateTimeInterval;
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
    disabled: Temporal.PlainDate.compare(date, today.toPlainDate()) < 0,
    label: dayFormatter.format(
      date.toZonedDateTime({
        plainTime: '00:00:00',
        timeZone: today.timeZone,
      }).epochMilliseconds,
    ),
    weekend: (date.dayOfWeek - 1) % 6 === 0,
  }));

  const calendarInterval: PlainDateInterval = {
    from: days.at(0)?.day as Temporal.PlainDate,
    until: days.at(-1)?.day as Temporal.PlainDate,
  };

  const visibleInterval: DateTimeInterval = {
    from: today,
    until: today.add({ days: maxDaysFromToday }),
  };

  return {
    calendarInterval,
    days,
    hourLabels,
    overallInterval,
    today,
    visibleInterval,
  };
}

export function createUnavailableIntervals({
  calendarInterval,
  freeTimeByWeekday,
  timeZone,
  visibleInterval,
}: {
  calendarInterval: PlainDateInterval;
  freeTimeByWeekday: Record<number, PlainTimeInterval>;
  timeZone: Temporal.TimeZone;
  visibleInterval: DateTimeInterval;
}): DateTimeInterval[] {
  const unavailableTimes: DateTimeInterval[] = [];

  let date = calendarInterval.from;
  while (Temporal.PlainDate.compare(date, calendarInterval.until) <= 0) {
    const weekday = date.dayOfWeek;
    const freeTime = freeTimeByWeekday[weekday];

    if (
      Temporal.ZonedDateTime.compare(
        date.toZonedDateTime({
          plainTime: '00:00:00',
          timeZone,
        }),
        visibleInterval.from,
      ) < 0 ||
      Temporal.ZonedDateTime.compare(
        date.toZonedDateTime({
          plainTime: '23:59:59',
          timeZone,
        }),
        visibleInterval.until,
      ) > 0
    ) {
      if (
        Temporal.PlainDate.compare(date, visibleInterval.from.toPlainDate()) ===
        0
      ) {
        unavailableTimes.push({
          from: date.toPlainDateTime('00:00:00').toZonedDateTime(timeZone),
          until: visibleInterval.from,
        });
      } else if (
        Temporal.PlainDate.compare(
          date,
          visibleInterval.until.toPlainDate(),
        ) === 0
      ) {
        unavailableTimes.push({
          from: visibleInterval.until,
          until: date.toPlainDateTime('23:59:59').toZonedDateTime(timeZone),
        });
      } else {
        unavailableTimes.push({
          from: date.toPlainDateTime('00:00:00').toZonedDateTime(timeZone),
          until: date.toPlainDateTime('23:59:59').toZonedDateTime(timeZone),
        });
      }
    }

    if (!freeTime) {
      unavailableTimes.push({
        from: date.toPlainDateTime('00:00:00').toZonedDateTime(timeZone),
        until: date.toPlainDateTime('23:59:59').toZonedDateTime(timeZone),
      });
    } else {
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
  const { firstDay, lastDay } = getFirstAndLastCalendarDays(options);

  let date = firstDay;

  const days: Temporal.PlainDate[] = [];
  while (Temporal.PlainDate.compare(date, lastDay) < 0) {
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

export function getEventRect({
  interval,
  overallInterval,
}: {
  interval: DateTimeInterval;
  overallInterval: PlainTimeInterval;
}): { height: number; top: number } {
  const fromTime = interval.from.epochSeconds;
  const untilTime = interval.until.epochSeconds;
  const overallIntervalFrom = interval.from.withPlainTime(
    overallInterval.from,
  ).epochSeconds;
  const overallIntervalUntil = interval.from.withPlainTime(
    overallInterval.until,
  ).epochSeconds;
  const totalTime = overallIntervalUntil - overallIntervalFrom;

  const top = ((fromTime - overallIntervalFrom) * 100) / totalTime;
  const height = ((untilTime - fromTime) * 100) / totalTime;
  return { height, top };
}

export function mergeIntervals(
  intervals: DateTimeInterval[],
): DateTimeInterval[] {
  const mergedIntervals: DateTimeInterval[] = [];

  intervals
    .slice()
    // Sort busy times by from then until
    .sort(sortIntervals)
    // For each possible busy interval, do this monstrosity
    .forEach((interval) => {
      // Find the index of the free interval that intersects with the beginning of the busy time
      const leftIndex = mergedIntervals.findIndex(
        (mergedInterval) =>
          Temporal.ZonedDateTime.compare(interval.from, mergedInterval.from) >=
            0 &&
          Temporal.ZonedDateTime.compare(interval.from, mergedInterval.until) <=
            0,
      );

      // Find the index of the free interval that intersects with the end of the busy time
      const rightIndex = mergedIntervals.findLastIndex(
        (mergedInterval) =>
          Temporal.ZonedDateTime.compare(
            interval.until,
            mergedInterval.until,
          ) >= 0 &&
          Temporal.ZonedDateTime.compare(interval.until, mergedInterval.from) <=
            0,
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
          Temporal.ZonedDateTime.compare(leftInterval.until, interval.until) > 0
            ? leftInterval.until
            : interval.until;
      }

      // Update the right interval to end at the current interval
      else if (!leftInterval && rightInterval) {
        rightInterval.from =
          Temporal.ZonedDateTime.compare(rightInterval.from, interval.from) < 0
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
