import { For, createResource, type Resource } from 'solid-js';
import { z } from 'zod';

import { classList } from '../../utils/jsx';
import Styles from './styles.module.css';

type BusyTimes = {
  from: Date;
  until: Date;
}[];

async function getBusyTimes() {
  try {
    const busyTimesResponse = await fetch('/meet/busy');
    const busyTimesData = await busyTimesResponse.json();
    const busyTimes = z
      .object({
        busyTimes: z.array(
          z.object({
            from: z.string().datetime(),
            until: z.string().datetime(),
          }),
        ),
      })
      .parse(busyTimesData)
      .busyTimes.map((busyTime) => ({
        from: new Date(busyTime.from),
        until: new Date(busyTime.until),
      }));
    return busyTimes;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

type Day = {
  disabled: boolean;
  weekend: boolean;
  label: string;
  from: Date;
  until: Date;
};

export function MeetWindow({ days, hours }: { days: Day[]; hours: string[] }) {
  const [busyTimes] = createResource(getBusyTimes);

  const goHome = () => {
    location.href = '/';
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
        <h2 class={Styles.MonthText}>
          <strong>March</strong> 2023
        </h2>
        <div class={Styles.Calendar}>
          <div
            classList={classList([Styles.Column, Styles['-Hours']])}
            aria-hidden="true"
          >
            <div class={Styles.DayHeader} />
            <For each={hours}>
              {(hour) => <div class={Styles.Hour}>{hour}</div>}
            </For>
          </div>
          <For each={days}>
            {(day, index) => (
              <DayColumn
                afterFirst={index() > 0}
                day={day}
                busyTimes={busyTimes}
                hours={hours}
              />
            )}
          </For>
        </div>
      </div>
    </main>
  );
}

function DayColumn({
  afterFirst,
  busyTimes,
  day,
  hours,
}: {
  afterFirst: boolean;
  busyTimes: Resource<BusyTimes>;
  day: Day;
  hours: string[];
}) {
  const intervalFrom = new Date(day.from);
  const intervalUntil = new Date(day.until);

  const busyTimesThisDay = () =>
    busyTimes()?.filter(
      ({ from, until }) =>
        (from >= intervalFrom && from <= intervalUntil) ||
        (until <= intervalUntil && until >= intervalUntil),
    );

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
      <ul class={Styles.Availability}>
        <For each={busyTimesThisDay()}>
          {(busyTime) => <Event interval={busyTime} />}
        </For>
      </ul>
    </div>
  );
}

function Event({ interval }: { interval: BusyTimes[number] }) {
  return (
    <li class={Styles.BusyEvent}>
      {interval.from.toTimeString()} - {interval.until.toTimeString()}
    </li>
  );
}
