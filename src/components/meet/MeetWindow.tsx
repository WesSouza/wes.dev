import { For, createMemo, createResource, type Resource } from 'solid-js';
import { z } from 'zod';

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
    console.log(busyTimes);
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

  return (
    <main class="Window">
      <div class="WindowTitle">
        <h1>My Availability</h1>
      </div>
      <div class="WindowContents">
        <h2>
          <strong>March</strong> 2023
        </h2>
        <div class="Calendar">
          <div class="Column -Hours" aria-hidden="true">
            {hours.map((hour) => (
              <div class="Hour">{hour}</div>
            ))}
          </div>
          <For each={days}>
            {(day) => <DayColumn day={day} busyTimes={busyTimes} />}
          </For>
        </div>
      </div>
    </main>
  );
}

function DayColumn({
  busyTimes,
  day,
}: {
  busyTimes: Resource<BusyTimes>;
  day: Day;
}) {
  const intervalFrom = new Date(day.from);
  const intervalUntil = new Date(day.until);

  const busyTimesThisDay = createMemo(() =>
    busyTimes()?.filter(
      ({ from, until }) =>
        (from >= intervalFrom && from <= intervalUntil) ||
        (until <= intervalUntil && until >= intervalUntil),
    ),
  );

  return (
    <div
      classList={{
        Column: true,
        '-Weekend': day.weekend,
        '-Disabled': day.disabled,
      }}
    >
      <h3>{day.label}</h3>
      <ul class="Availability">
        <For each={busyTimesThisDay()}>
          {(busyTime) => <Event interval={busyTime} />}
        </For>
      </ul>
    </div>
  );
}

function Event({ interval }: { interval: BusyTimes[number] }) {
  return (
    <li>
      {interval.from.toTimeString()} - {interval.until.toTimeString()}
    </li>
  );
}
