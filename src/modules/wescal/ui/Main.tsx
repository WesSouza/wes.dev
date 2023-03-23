import { Temporal } from 'temporal-polyfill';
import { createMemo, createResource, createSignal } from 'solid-js';
import { z } from 'zod';

import type {
  DateTimeInterval,
  PlainTimeInterval,
  StringTimeInterval,
} from '../lib/schema';
import {
  createCalendarGridData,
  createUnavailableIntervals,
  mergeIntervals,
} from '../lib/utils';
import { Calendar } from './Calendar';
import { NewEventForm, type NewEventFormData } from './NewEventForm';
import { Popover } from './Popover';
import { Window } from './Window';

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

export function Main(options: {
  daysPerPage?: number;
  eventDuration?: number;
  gridSlotDuration?: number;
  inviteeName: string;
  inviteeEmail: string;
  inviteeTimeZone: string;
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
    daysPerPage = 7,
    eventDuration = 1800,
    gridSlotDuration = 900,
    inviteeName,
    inviteeEmail,
    inviteeTimeZone,
  } = options;

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
  const [newEventDetails, setNewEventDetails] =
    createSignal<NewEventFormData>();
  const [newEventPopupPosition, setNewEventPopupPosition] =
    createSignal<DOMRect>();

  const handleSelectTime = (interval: DateTimeInterval) => {
    setNewEventPopupVisible(true);
    setNewEventPopupPosition(new DOMRect(30, 30, 300, 0));
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
        ['prodid', {}, 'text', '-//Wes.dev//WesCal//EN'],
        ['version', {}, 'text', '2.0'],
        ['calscale', {}, 'text', 'GREGORIAN'],
        ['method', {}, 'text', 'REQUEST'],
      ],
      [
        [
          'vtimezone',
          [['tzid', {}, 'text', inviteeTimeZone]],
          [
            // Don't tell anyone this is empty
          ],
        ],
        [
          'vevent',
          [
            [
              'last-modified',
              {},
              'date-time',
              Temporal.Now.instant().toString(),
            ],
            [
              'dtstart',
              { tzid: inviteeTimeZone },
              'date-time',
              newEvent.from
                .withTimeZone(inviteeTimeZone)
                .toPlainDateTime()
                .toString(),
            ],
            [
              'dtend',
              { tzid: inviteeTimeZone },
              'date-time',
              newEvent.until
                .withTimeZone(inviteeTimeZone)
                .toPlainDateTime()
                .toString(),
            ],
            ['dtstamp', {}, 'date-time', Temporal.Now.instant().toString()],
            ['created', {}, 'date-time', Temporal.Now.instant().toString()],
            ['summary', {}, 'text', newEvent.title],
            ['transp', {}, 'text', 'OPAQUE'],
            ['sequence', {}, 'integer', 0],
            [
              'attendee',
              {
                cutype: 'INDIVIDUAL',
                role: 'REQ-PARTICIPANT',
                partstat: 'NEEDS-ACTION',
                rsvp: 'true',
                cn: inviteeName,
                'x-num-guests': '0',
              },
              'cal-address',
              `mailto:${inviteeEmail}`,
            ],
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
    document.body.appendChild(anchor);
    anchor.click();

    URL.revokeObjectURL(url);
  };

  const handleGoogleClick = () => {
    const newEvent = newEventDetails();
    if (!newEvent) {
      return;
    }

    const fromString = newEvent.from
      .withTimeZone(inviteeTimeZone)
      .toPlainDateTime()
      .toString()
      .replace(/[-:]/g, '');
    const untilString = newEvent.until
      .withTimeZone(inviteeTimeZone)
      .toPlainDateTime()
      .toString()
      .replace(/[-:]/g, '');

    const url = new URL(
      'https://www.google.com/calendar/render?action=TEMPLATE',
    );
    url.searchParams.set('text', newEvent.title);
    url.searchParams.set('dates', `${fromString}/${untilString}`);
    url.searchParams.set('add', inviteeEmail);
    url.searchParams.set('ctz', inviteeTimeZone);

    window.open(url);
  };

  const handleCancelClick = () => {
    setNewEventPopupVisible(false);
  };

  return (
    <Window title="My Availability" onClose={goHome}>
      <Calendar
        busyTimesByDay={busyTimesByDay()}
        days={days}
        eventDuration={eventDuration}
        gridSlotDuration={gridSlotDuration}
        handleSelectTime={handleSelectTime}
        hourLabels={hourLabels}
        navigateDays={navigateDays}
        overallInterval={overallInterval}
        timeZone={options.timeZone}
      />

      <Popover showWhen={newEventPopupVisible} position={newEventPopupPosition}>
        <NewEventForm
          event={newEventDetails}
          onClose={handleCancelClick}
          onGoogleClick={handleGoogleClick}
          onICalClick={handleICalClick}
        />
      </Popover>
    </Window>
  );
}
