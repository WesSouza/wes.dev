import { Temporal } from 'temporal-polyfill';
import { For, Show, createMemo, createSignal, onMount } from 'solid-js';

import { classList } from '../../../utils/jsx';
import type {
  CalendarDayMeta,
  DateTimeInterval,
  PlainTimeInterval,
} from '../lib/schema';
import Styles from './CalendarDay.module.css';
import { BusyInterval, NewEvent } from './Events';

const anyDateTime = Temporal.Now.zonedDateTimeISO();

export function CalendarDay(props: {
  afterFirst: boolean;
  busyTimesByDay: Record<string, DateTimeInterval[]>;
  day: CalendarDayMeta;
  eventDuration: number;
  locale: string;
  gridSlotDuration: number;
  hours: string[];
  onSelectTime: (interval: DateTimeInterval) => void;
  overallInterval: PlainTimeInterval;
  timeZone: Temporal.TimeZoneLike;
}) {
  const busyTimes = () => props.busyTimesByDay[props.day.day.toString()];

  const [columnBoundingRect, setColumnBoundingRect] = createSignal<DOMRect>();

  const totalTime = createMemo(() => {
    return props.overallInterval.from.until(props.overallInterval.until, {
      smallestUnit: 'second',
      largestUnit: 'second',
    }).seconds;
  });

  const [newEventSlot, setNewEventSlot] = createSignal(-1);

  const newEvent = () => {
    const eventSlot = newEventSlot();
    if (!props.day.availableFrom) {
      return {
        interval: { from: anyDateTime, until: anyDateTime },
        visible: false,
      };
    }

    const timeZone = Temporal.Now.timeZone();
    const fromSeconds = eventSlot * props.gridSlotDuration;
    const from = props.day.availableFrom
      .toZonedDateTime({ plainDate: props.day.day, timeZone })
      .add({ seconds: fromSeconds });
    const until = from.add({ seconds: props.eventDuration });

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
      (cursorY * totalTime()) / props.gridSlotDuration / boundingRect.height,
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
      (cursorY * totalTime()) / props.gridSlotDuration / boundingRect.height,
    );

    if (!props.day.availableFrom) {
      return;
    }

    const timeZone = Temporal.Now.timeZone();
    const fromSeconds = eventSlot * props.gridSlotDuration;
    const from = props.day.availableFrom
      .toZonedDateTime({ plainDate: props.day.day, timeZone })
      .add({ seconds: fromSeconds });
    const until = from.add({ seconds: props.eventDuration });

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

    props.onSelectTime({ from, until });
  };

  return (
    <div
      classList={{
        [Styles.Column as string]: true,
        [Styles['-AfterFirst'] as string]: props.afterFirst,
        [Styles['-Weekend'] as string]: props.day.weekend,
        [Styles['-Disabled'] as string]: props.day.disabled,
      }}
    >
      <h3 class={Styles.DayHeader}>{props.day.label}</h3>
      <For each={props.hours}>
        {(_, index) => (
          <div
            classList={classList([
              Styles.HourLane,
              {
                [Styles['-Last'] as string]: index() === props.hours.length - 1,
              },
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
              overallInterval={props.overallInterval}
            />
          )}
        </For>
        <Show when={newEvent().visible}>
          <NewEvent
            event={newEvent}
            locale={props.locale}
            overallInterval={props.overallInterval}
          />
        </Show>
      </ul>
    </div>
  );
}
