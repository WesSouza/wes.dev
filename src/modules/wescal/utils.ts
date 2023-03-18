import type { CalendarDay, CalendarDayMeta, TimeInterval } from './schema';

export function sortIntervals(left: TimeInterval, right: TimeInterval) {
  const fromSort = left.from.valueOf() - right.from.valueOf();
  if (fromSort !== 0) {
    return fromSort;
  }
  return left.until.valueOf() - right.until.valueOf();
}

export function createCalendarGridData(options: {
  freeHoursByWeekday: Record<number, { from: number; until: number }>;
  maxDaysFromToday: number;
  staringAtWeekday?: number;
  today?: Date | undefined;
}): { days: CalendarDayMeta[]; hourLabels: string[] } {
  const {
    freeHoursByWeekday,
    maxDaysFromToday,
    staringAtWeekday = 0,
    today = new Date(),
  } = options;

  const timeFormatter = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
  });

  const dayFormatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    day: 'numeric',
  });

  const minHour = Object.values(freeHoursByWeekday).reduce(
    (previous, freeHours) => Math.min(freeHours.from, previous),
    24,
  );

  const maxHour = Object.values(freeHoursByWeekday).reduce(
    (previous, freeHours) => Math.max(freeHours.until, previous),
    0,
  );

  const hourLabels = Array.from({ length: maxHour - minHour + 1 }, (_, index) =>
    timeFormatter.format(new Date(2000, 0, 1, minHour + index, 0, 0)),
  );

  const todayAtMidnight = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    0,
    0,
    0,
  );
  const lastDayAtMidnight = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + maxDaysFromToday - 1,
    23,
    59,
    59,
  );

  const firstDayOfWeek = today.getDate() - today.getDay() + staringAtWeekday;
  const lastDayOfWeek =
    lastDayAtMidnight.getDate() + 7 - lastDayAtMidnight.getDay();
  console.log(lastDayAtMidnight);

  const days = Array.from(
    { length: lastDayOfWeek - firstDayOfWeek },
    (_, index) => {
      const dayDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        firstDayOfWeek + index,
        12,
        0,
        0,
      );
      const day = {
        year: dayDate.getFullYear(),
        month: dayDate.getMonth(),
        day: dayDate.getDate(),
      };
      const dayOfTheWeek = day.day;
      return {
        disabled: dayDate < todayAtMidnight || dayDate > lastDayAtMidnight,
        weekend: dayOfTheWeek % 6 === 0,
        label: dayFormatter.format(dayDate),
        day,
        from: new Date(
          dayDate.getFullYear(),
          dayDate.getMonth(),
          dayDate.getDate(),
          minHour,
          0,
          0,
        ),
        until: new Date(
          dayDate.getFullYear(),
          dayDate.getMonth(),
          dayDate.getDate(),
          maxHour,
          59,
          59,
        ),
        availableFrom: new Date(
          dayDate.getFullYear(),
          dayDate.getMonth(),
          dayDate.getDate(),
          freeHoursByWeekday[dayOfTheWeek]?.from,
          0,
          0,
        ),
        availableUntil: new Date(
          dayDate.getFullYear(),
          dayDate.getMonth(),
          dayDate.getDate(),
          freeHoursByWeekday[dayOfTheWeek]?.until,
          59,
          59,
        ),
      };
    },
  );

  return { days, hourLabels };
}

export function dateToDay(date: Date): CalendarDay {
  return {
    year: date.getFullYear(),
    month: date.getMonth(),
    day: date.getDate(),
  };
}

export function equalDays(left: CalendarDay, right: CalendarDay) {
  return (
    left.year === right.year &&
    left.month === right.month &&
    left.day === right.day
  );
}

function minDate(left: Date, right: Date) {
  if (right < left) {
    return right;
  }
  return left;
}

function maxDate(left: Date, right: Date) {
  if (right > left) {
    return right;
  }
  return left;
}

export function mergeIntervals(intervals: TimeInterval[]): TimeInterval[] {
  const mergedIntervals: TimeInterval[] = [];

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
        leftInterval.until = maxDate(leftInterval.until, interval.until);
      }

      // Update the right interval to end at the current interval
      else if (!leftInterval && rightInterval) {
        rightInterval.from = minDate(rightInterval.from, interval.from);
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
