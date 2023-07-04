import { For, type Accessor } from 'solid-js';
import { Temporal } from 'temporal-polyfill';

import type {
  CalendarDayMeta,
  DateTimeInterval,
  PlainTimeInterval,
} from '../lib/schema';
import Styles from './Calendar.module.css';
import { CalendarDay } from './CalendarDay';
import CalendarDayStyles from './CalendarDay.module.css';

export function Calendar(props: {
  busyTimesByDay: Record<string, DateTimeInterval[]>;
  days: Accessor<CalendarDayMeta[]>;
  eventDuration: number;
  gridSlotDuration: number;
  handleSelectTime: (interval: DateTimeInterval) => void;
  hourLabels: string[];
  locale: string;
  navigateDays: (options: { delta?: number; page?: number }) => void;
  overallInterval: PlainTimeInterval;
  timeZone: Temporal.TimeZoneLike;
}) {
  const firstDay = props.days().at(0);
  if (!firstDay) {
    return null;
  }

  const dateFormatter = new Intl.DateTimeFormat(props.locale, {
    month: 'long',
    year: 'numeric',
  });
  const dateParts = dateFormatter.formatToParts(
    firstDay.day.toZonedDateTime({
      timeZone: Temporal.Now.zonedDateTimeISO(),
      plainTime: '00:00:00',
    }).epochMilliseconds,
  );
  const before: string[] = [];
  const month: string[] = [];
  const after: string[] = [];
  dateParts.forEach((part) => {
    if (part.type === 'month') {
      month.push(part.value);
    } else if (month.length === 0) {
      before.push(part.value);
    } else {
      after.push(part.value);
    }
  });

  return (
    <>
      <div class={Styles.CalendarTitle}>
        <h2 class={Styles.MonthText}>
          {before.join('')}
          <strong>{month.join('')}</strong>
          {after.join('')}
        </h2>
        <div class={Styles.NavigationButtons}>
          <button
            class={Styles.NavigationButton}
            onClick={() => props.navigateDays({ delta: -1 })}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="7"
              height="11"
              viewBox="0 0 7 11"
              fill="none"
            >
              <path
                fill="currentColor"
                d="M.5 5.5 6 0h1v1L2.5 5.5 7 10v1H6L.5 5.5Z"
              />
            </svg>
          </button>
          <button
            class={Styles.NavigationButton}
            onClick={() => props.navigateDays({ page: 0 })}
          >
            Today
          </button>
          <button
            class={Styles.NavigationButton}
            onClick={() => props.navigateDays({ delta: 1 })}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="7"
              height="11"
              viewBox="0 0 7 11"
              fill="none"
            >
              <path
                fill="currentColor"
                d="M6.5 5.5 1 11H0v-1l4.5-4.5L0 1V0h1l5.5 5.5Z"
              />
            </svg>
          </button>
        </div>
      </div>
      <div class={Styles.Calendar}>
        <div class={CalendarDayStyles.Column} aria-hidden="true">
          <div class={CalendarDayStyles.DayHeader} />
          <For each={props.hourLabels}>
            {(hour) => <div class={Styles.Hour}>{hour}</div>}
          </For>
        </div>
        <For each={props.days()}>
          {(day, index) => (
            <CalendarDay
              afterFirst={index() > 0}
              busyTimesByDay={props.busyTimesByDay}
              day={day}
              eventDuration={props.eventDuration}
              gridSlotDuration={props.gridSlotDuration}
              locale={props.locale}
              hours={props.hourLabels}
              onSelectTime={props.handleSelectTime}
              overallInterval={props.overallInterval}
              timeZone={props.timeZone}
            />
          )}
        </For>
      </div>
    </>
  );
}
