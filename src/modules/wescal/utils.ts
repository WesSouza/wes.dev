import type { TimeInterval } from './schema';

export function sortIntervals(left: TimeInterval, right: TimeInterval) {
  const fromSort = left.from.valueOf() - right.from.valueOf();
  if (fromSort !== 0) {
    return fromSort;
  }
  return left.until.valueOf() - right.until.valueOf();
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
