import type { Accessor } from 'solid-js';

import type { DateTimeInterval, PlainTimeInterval } from '../lib/schema';
import { getEventRect } from '../lib/utils';
import Styles from './Events.module.css';

export function BusyInterval(props: {
  interval: DateTimeInterval;
  overallInterval: PlainTimeInterval;
}) {
  const data = () => getEventRect(props);

  return (
    <li
      data-type="BusyInterval"
      class={Styles.BusyEvent}
      style={{ '--height': `${data().height}%`, '--offset': `${data().top}%` }}
    ></li>
  );
}

export function NewEvent(props: {
  event: Accessor<{ interval: DateTimeInterval }>;
  locale: string;
  overallInterval: PlainTimeInterval;
}) {
  const timeFormatter = new Intl.DateTimeFormat(props.locale, {
    hour: 'numeric',
    minute: 'numeric',
  });

  const data = () => {
    const { interval } = props.event();
    return {
      ...getEventRect({ interval, overallInterval: props.overallInterval }),
      interval,
    };
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
