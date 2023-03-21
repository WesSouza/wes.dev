import { Temporal } from '@js-temporal/polyfill';
import {
  For,
  Show,
  createMemo,
  createResource,
  createSignal,
  onMount,
  type Accessor,
} from 'solid-js';
import { z } from 'zod';

import type {
  CalendarDayMeta,
  DateTimeInterval,
  PlainTimeInterval,
  StringTimeInterval,
} from '../../modules/wescal/schema';
import {
  createCalendarGridData,
  createUnavailableIntervals,
  getEventRect,
  mergeIntervals,
} from '../../modules/wescal/utils';
import { classList } from '../../utils/jsx';
import Styles from './styles.module.css';

const daysPerPage = 7;
const eventDuration = 1800;
const gridSlotDuration = 900;

const irrelevantDateTime = Temporal.Now.zonedDateTimeISO();

const timeFormatter = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: 'numeric',
});

type NewEventData = DateTimeInterval & {
  title: string;
};

async function getBusyTimes() {
  try {
    const timeZone = Temporal.Now.timeZone();
    const busyTimesResponse = await fetch('/meet/busy');
    const busyTimesData = await busyTimesResponse.json();
    const busyTimes = z
      .object({
        busyTimes: z.array(
          z.object({
            from: z.string(),
            until: z.string(),
          }),
        ),
      })
      .parse(busyTimesData)
      .busyTimes.map((busyTime) => ({
        from: Temporal.ZonedDateTime.from(busyTime.from).withTimeZone(timeZone),
        until: Temporal.ZonedDateTime.from(busyTime.until).withTimeZone(
          timeZone,
        ),
      }));
    return busyTimes;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export function MeetWindow(options: {
  freeTimeByWeekday: Record<number, StringTimeInterval>;
  maxDaysFromToday: number;
  startingAtWeekday?: number | undefined;
  timeZone: Temporal.TimeZoneLike;
  today?: Temporal.ZonedDateTime | undefined;
}) {
  let ICAL: typeof import('ical.js');
  import('ical.js').then((module) => (ICAL = module));

  const freeTimeByWeekday = Object.entries(options.freeTimeByWeekday).reduce<
    Record<number, PlainTimeInterval>
  >((freeTimes, [dayOfWeek, interval]) => {
    freeTimes[Number(dayOfWeek)] = {
      from: Temporal.PlainTime.from(interval.from),
      until: Temporal.PlainTime.from(interval.until),
    };
    return freeTimes;
  }, {});

  const {
    calendarInterval,
    days: allDays,
    hourLabels,
    overallInterval,
    today,
    visibleInterval,
  } = createCalendarGridData({ ...options, freeTimeByWeekday });

  const [busyTimesResource] = createResource(getBusyTimes);
  const [page, setPage] = createSignal(0);
  const pages = Math.ceil(allDays.length / daysPerPage);

  const busyTimesByDay = createMemo(() => {
    const unavailableIntervals = createUnavailableIntervals({
      calendarInterval,
      freeTimeByWeekday,
      timeZone: today.timeZone as Temporal.TimeZone,
      visibleInterval,
    });

    const calendarBusyIntervals = busyTimesResource();
    if (!calendarBusyIntervals) {
      return {};
    }

    const busyIntervals = mergeIntervals([
      ...unavailableIntervals,
      ...calendarBusyIntervals,
    ]);

    return busyIntervals.reduce<Record<string, DateTimeInterval[]>>(
      (busyIntervalsByDay, interval) => {
        const day = interval.from.toPlainDate().toString();

        if (!busyIntervalsByDay[day]) {
          busyIntervalsByDay[day] = [];
        }

        busyIntervalsByDay[day]?.push(interval);

        return busyIntervalsByDay;
      },
      {},
    );
  });

  const goHome = () => {
    location.href = '/';
  };

  const days = () =>
    allDays.filter((_, index) => Math.floor(index / daysPerPage) === page());

  const navigateDays = ({
    delta,
    page: toPage,
  }: {
    delta?: number;
    page?: number;
  }) => {
    let navigateToPage = toPage;
    if (delta !== undefined) {
      navigateToPage = page() + delta;
    }

    if (
      navigateToPage === undefined ||
      navigateToPage < 0 ||
      navigateToPage >= pages
    ) {
      return;
    }

    setPage(navigateToPage);
  };

  const [newEventPopupVisible, setNewEventPopupVisible] = createSignal(false);
  const [newEventDetails, setNewEventDetails] = createSignal<NewEventData>();

  const handleSelectTime = (interval: DateTimeInterval) => {
    setNewEventPopupVisible(true);
    setNewEventDetails({
      ...interval,
      title: 'Virtual Coffee',
    });
  };

  const handleICalClick = () => {
    const newEvent = newEventDetails();
    if (!newEvent || !ICAL) {
      return;
    }

    const vCalendar = new ICAL.Component([
      'vcalendar',
      [
        ['calscale', {}, 'text', 'GREGORIAN'],
        ['x-wr-calname', {}, 'text', newEvent.title],
        ['method', {}, 'text', 'PUBLISH'],
        ['prodid', {}, 'text', '-//Wes.dev//WesCal//EN'],
        ['version', {}, 'text', '1.0'],
      ],
      [
        [
          'vtimezone',
          [['tzid', {}, 'text', 'America/New_York']],
          [
            [
              'daylight',
              [
                ['dtstart', {}, 'date-time', '2007-03-11T02:00:00'],
                [
                  'rrule',
                  {},
                  'recur',
                  {
                    freq: 'YEARLY',
                    byday: '2SU',
                    bymonth: 3,
                  },
                ],
                ['tzname', {}, 'text', 'EDT'],
                ['tzoffsetfrom', {}, 'utc-offset', '-05:00'],
                ['tzoffsetto', {}, 'utc-offset', '-04:00'],
              ],
              [],
            ],
            [
              'standard',
              [
                ['dtstart', {}, 'date-time', '2007-11-04T02:00:00'],
                [
                  'rrule',
                  {},
                  'recur',
                  {
                    freq: 'YEARLY',
                    byday: '1SU',
                    bymonth: 11,
                  },
                ],
                ['tzname', {}, 'text', 'EST'],
                ['tzoffsetfrom', {}, 'utc-offset', '-04:00'],
                ['tzoffsetto', {}, 'utc-offset', '-05:00'],
              ],
              [],
            ],
          ],
        ],
        [
          'vevent',
          [
            [
              'dtstart',
              { tzid: 'America/New_York' },
              'date-time',
              newEvent.from
                .withTimeZone('America/New_York')
                .toPlainDateTime()
                .toString(),
            ],
            [
              'dtend',
              { tzid: 'America/New_York' },
              'date-time',
              newEvent.until
                .withTimeZone('America/New_York')
                .toPlainDateTime()
                .toString(),
            ],
            ['summary', {}, 'text', newEvent.title],
            ['transp', {}, 'text', 'OPAQUE'],
            ['sequence', {}, 'integer', 1],
            ['attendee', {}, 'cal-address', 'tiredsoftwareengineer@gmail.com'],
            ['description', {}, 'text', 'Ola bom dia!'],
            ['uid', {}, 'text', `${Math.random()}@wes.dev`],
          ],
          [],
        ],
      ],
    ]);

    const blob = new Blob([vCalendar.toString()], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);

    const anchor = document.createElement('a');
    anchor.download = 'Meet with Wes.ics';
    anchor.href = url;
    anchor.click();

    URL.revokeObjectURL(url);
  };

  const handleGoogleClick = () => {
    const newEvent = newEventDetails();
    if (!newEvent) {
      return;
    }

    const fromString = newEvent.from
      .withTimeZone('America/New_York')
      .toPlainDateTime()
      .toString()
      .replace(/[-:]/g, '');
    const untilString = newEvent.until
      .withTimeZone('America/New_York')
      .toPlainDateTime()
      .toString()
      .replace(/[-:]/g, '');

    const url = new URL(
      'https://www.google.com/calendar/render?action=TEMPLATE',
    );
    url.searchParams.set('text', newEvent.title);
    url.searchParams.set('dates', `${fromString}/${untilString}`);
    url.searchParams.set('add', 'hey@wes.dev');
    url.searchParams.set('ctz', 'America/New_York');
    console.log(url.toString());

    window.open(url);
  };

  return (
    <main class={Styles.Window}>
      <div class={Styles.WindowTitle}>
        <div class={Styles.WindowSemaphore}>
          <button
            aria-label="Fake Close Window"
            classList={classList([
              Styles.WindowSemaphoreButton,
              Styles.CloseWindowButton,
            ])}
            onClick={goHome}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              class={Styles.WindowSemaphoreIcon}
            >
              <path fill="#721D10" d="M3 3.707 3.707 3 9.01 8.303l-.707.707z" />
              <path fill="#721D10" d="m8.303 3 .707.707L3.707 9.01 3 8.303z" />
            </svg>
          </button>
          <button
            aria-label="Fake Minimize Window"
            classList={classList([
              Styles.WindowSemaphoreButton,
              Styles.MinimizeWindowButton,
            ])}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              class={Styles.WindowSemaphoreIcon}
            >
              <path fill="#A97524" d="M2 5h8v2H2z" />
            </svg>
          </button>
          <button
            aria-label="Fake Full Screen Window"
            classList={classList([
              Styles.WindowSemaphoreButton,
              Styles.FullScreenWindowButton,
            ])}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              class={Styles.WindowSemaphoreIcon}
            >
              <path fill="#295E12" d="M3 7V3h4L3 7ZM9 5v4H5l4-4Z" />
            </svg>
          </button>
        </div>
        <h1 class={Styles.WindowTitleText}>My Availability</h1>
        <div class={Styles.WindowAntiSemaphore}></div>
      </div>
      <div class={Styles.WindowContents}>
        <div class={Styles.CalendarTitle}>
          <h2 class={Styles.MonthText}>
            <strong>March</strong> 2023
          </h2>
          <div class={Styles.NavigationButtons}>
            <button
              class={Styles.NavigationButton}
              onClick={() => navigateDays({ delta: -1 })}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="7"
                height="11"
                viewBox="0 0 7 11"
                fill="none"
              >
                <path
                  fill="#000"
                  d="M.5 5.5 6 0h1v1L2.5 5.5 7 10v1H6L.5 5.5Z"
                />
              </svg>
            </button>
            <button
              class={Styles.NavigationButton}
              onClick={() => navigateDays({ page: 0 })}
            >
              Today
            </button>
            <button
              class={Styles.NavigationButton}
              onClick={() => navigateDays({ delta: 1 })}
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
          <div
            classList={classList([Styles.Column, Styles['-Hours']])}
            aria-hidden="true"
          >
            <div class={Styles.DayHeader} />
            <For each={hourLabels}>
              {(hour) => <div class={Styles.Hour}>{hour}</div>}
            </For>
          </div>
          <For each={days()}>
            {(day, index) => (
              <DayColumn
                afterFirst={index() > 0}
                day={day}
                busyTimesByDay={busyTimesByDay}
                hours={hourLabels}
                onSelectTime={handleSelectTime}
                overallInterval={overallInterval}
                timeZone={options.timeZone}
              />
            )}
          </For>
        </div>
      </div>
      <Show when={newEventPopupVisible()}>
        <form
          class={Styles.NewEventForm}
          onSubmit={(event) => event.preventDefault()}
        >
          <input
            type="text"
            name="title"
            value={newEventDetails()?.title ?? ''}
          />
          <input
            type="date"
            name="fromDate"
            value={newEventDetails()?.from.toPlainDate().toString() ?? ''}
          />
          <input
            type="time"
            name="fromTime"
            value={newEventDetails()?.from.toPlainTime().toString() ?? ''}
          />
          <input
            type="date"
            name="untilDate"
            value={newEventDetails()?.until.toPlainDate().toString() ?? ''}
          />
          <input
            type="time"
            name="untilTime"
            value={newEventDetails()?.until.toPlainTime().toString() ?? ''}
          />
          <button type="button" onClick={handleICalClick}>
            iCal
          </button>
          <button type="button" onClick={handleGoogleClick}>
            Google
          </button>
        </form>
      </Show>
    </main>
  );
}

function DayColumn({
  afterFirst,
  busyTimesByDay,
  day,
  hours,
  onSelectTime,
  overallInterval,
}: {
  afterFirst: boolean;
  busyTimesByDay: Accessor<Record<string, DateTimeInterval[]>>;
  day: CalendarDayMeta;
  hours: string[];
  onSelectTime: (interval: DateTimeInterval) => void;
  overallInterval: PlainTimeInterval;
  timeZone: Temporal.TimeZoneLike;
}) {
  const busyTimes = () => busyTimesByDay()[day.day.toString()];

  const [columnBoundingRect, setColumnBoundingRect] = createSignal<DOMRect>();

  const totalTime = createMemo(() => {
    return overallInterval.from.until(overallInterval.until, {
      smallestUnit: 'second',
      largestUnit: 'second',
    }).seconds;
  });

  const [newEventSlot, setNewEventSlot] = createSignal(-1);

  const newEvent = () => {
    const eventSlot = newEventSlot();
    if (!day.availableFrom) {
      return {
        interval: { from: irrelevantDateTime, until: irrelevantDateTime },
        visible: false,
      };
    }

    const timeZone = Temporal.Now.timeZone();
    const fromSeconds = eventSlot * gridSlotDuration;
    const from = day.availableFrom
      .toZonedDateTime({ plainDate: day.day, timeZone })
      .add({ seconds: fromSeconds });
    const until = from.add({ seconds: eventDuration });

    const visible =
      eventSlot >= 0 &&
      busyTimes()?.find(
        (interval) =>
          (Temporal.ZonedDateTime.compare(interval.from, from) <= 0 &&
            Temporal.ZonedDateTime.compare(interval.until, from) > 0) ||
          (Temporal.ZonedDateTime.compare(interval.from, until) < 0 &&
            Temporal.ZonedDateTime.compare(interval.until, until) >= 0),
      ) === undefined;

    return { interval: { from, until }, visible };
  };

  let ref: HTMLUListElement;

  onMount(() => {
    setColumnBoundingRect(ref.getBoundingClientRect());
  });

  const handleMouseMove = (
    event: MouseEvent & {
      currentTarget: HTMLUListElement;
      target: Element;
    },
  ) => {
    const boundingRect = columnBoundingRect();
    if (!boundingRect) {
      return;
    }

    const cursorY = event.clientY - boundingRect.top;
    const newEventSlot = Math.floor(
      (cursorY * totalTime()) / gridSlotDuration / boundingRect.height,
    );

    setNewEventSlot(newEventSlot);
  };

  const handleMouseLeave = (
    event: MouseEvent & {
      currentTarget: HTMLUListElement;
      target: Element;
    },
  ) => {
    if (event.currentTarget !== event.target) {
      return;
    }

    setNewEventSlot(-1);
  };

  const handleClick = (
    event: MouseEvent & {
      currentTarget: HTMLUListElement;
      target: Element;
    },
  ) => {
    const boundingRect = columnBoundingRect();
    if (!boundingRect) {
      return;
    }

    const cursorY = event.clientY - boundingRect.top;
    const eventSlot = Math.floor(
      (cursorY * totalTime()) / gridSlotDuration / boundingRect.height,
    );

    if (!day.availableFrom) {
      return;
    }

    const timeZone = Temporal.Now.timeZone();
    const fromSeconds = eventSlot * gridSlotDuration;
    const from = day.availableFrom
      .toZonedDateTime({ plainDate: day.day, timeZone })
      .add({ seconds: fromSeconds });
    const until = from.add({ seconds: eventDuration });

    const visible =
      eventSlot >= 0 &&
      busyTimes()?.find(
        (interval) =>
          (Temporal.ZonedDateTime.compare(interval.from, from) <= 0 &&
            Temporal.ZonedDateTime.compare(interval.until, from) > 0) ||
          (Temporal.ZonedDateTime.compare(interval.from, until) < 0 &&
            Temporal.ZonedDateTime.compare(interval.until, until) >= 0),
      ) === undefined;

    if (!visible) {
      return;
    }

    onSelectTime({ from, until });
  };

  return (
    <div
      classList={{
        [Styles.Column as string]: true,
        [Styles['-AfterFirst'] as string]: afterFirst,
        [Styles['-Weekend'] as string]: day.weekend,
        [Styles['-Disabled'] as string]: day.disabled,
      }}
    >
      <h3 class={Styles.DayHeader}>{day.label}</h3>
      <For each={hours}>
        {(_, index) => (
          <div
            classList={classList([
              Styles.HourLane,
              { [Styles['-Last'] as string]: index() === hours.length - 1 },
            ])}
          />
        )}
      </For>
      <ul
        // @ts-expect-error Variable 'ref' is used before being assigned. ts(2454)
        ref={ref}
        class={Styles.Availability}
        onMouseOver={handleMouseMove}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        <For each={busyTimes()}>
          {(busyTime) => (
            <BusyInterval
              interval={busyTime}
              overallInterval={overallInterval}
            />
          )}
        </For>
        <Show when={newEvent().visible}>
          <NewEvent event={newEvent} overallInterval={overallInterval} />
        </Show>
      </ul>
    </div>
  );
}

function BusyInterval({
  interval,
  overallInterval,
}: {
  interval: DateTimeInterval;
  overallInterval: PlainTimeInterval;
}) {
  const { height, top } = getEventRect({ interval, overallInterval });

  return (
    <li
      data-type="BusyInterval"
      class={Styles.BusyEvent}
      style={{ '--height': `${height}%`, '--offset': `${top}%` }}
    ></li>
  );
}

function NewEvent({
  event: event,
  overallInterval,
}: {
  event: Accessor<{ interval: DateTimeInterval }>;
  overallInterval: PlainTimeInterval;
}) {
  const data = () => {
    const { interval } = event();
    const { height, top } = getEventRect({ interval, overallInterval });
    return { height, interval, top };
  };

  return (
    <li
      class={Styles.Event}
      style={{
        '--height': `${data().height}%`,
        '--offset': `${data().top}%`,
      }}
    >
      <time
        class={Styles.EventTime}
        dateTime={data().interval.from.toPlainTime().toString()}
      >
        {timeFormatter.format(data().interval.from.epochMilliseconds)}
      </time>
    </li>
  );
}
