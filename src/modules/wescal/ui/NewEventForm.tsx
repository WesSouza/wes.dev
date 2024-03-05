import type { Accessor } from 'solid-js';

import { classList } from '../../../utils/jsx';
import type { DateTimeInterval } from '../lib/schema';
import Styles from './NewEventForm.module.css';
import PopoverStyles from './Popover.module.css';

export type NewEventFormData = DateTimeInterval & {
  title: string;
};

export function NewEventForm(props: {
  event: Accessor<NewEventFormData | undefined>;
  onClose: () => void;
  onICalClick: () => void;
  onGoogleClick: () => void;
}) {
  return (
    <form
      class={Styles.NewEventForm}
      onSubmit={(event) => event.preventDefault()}
    >
      <div
        classList={classList([
          PopoverStyles.PopoverContent,
          Styles.NewEventTitle,
        ])}
      >
        <input
          aria-label="Event Title"
          class={Styles.NewEventTitleInput}
          type="text"
          name="title"
          value={props.event()?.title ?? ''}
        />
      </div>
      <div
        classList={classList([
          PopoverStyles.PopoverContent,
          Styles.NewEventDetails,
        ])}
      >
        <div class={Styles.NewEventField}>
          <label class={Styles.NewEventFieldLabel} for="fromDate">
            starts:
          </label>
          <div class={Styles.NewEventFieldControl}>
            <input
              class={Styles.NewEventFieldDate}
              id="fromDate"
              type="date"
              name="fromDate"
              value={props.event()?.from.toPlainDate().toString() ?? ''}
            />
            <input
              class={Styles.NewEventFieldTime}
              type="time"
              name="fromTime"
              value={props.event()?.from.toPlainTime().toString() ?? ''}
            />
          </div>
        </div>
        <div class={Styles.NewEventField}>
          <label class={Styles.NewEventFieldLabel} for="untilDate">
            ends:
          </label>
          <div class={Styles.NewEventFieldControl}>
            <input
              class={Styles.NewEventFieldDate}
              id="untilDate"
              type="date"
              name="untilDate"
              value={props.event()?.until.toPlainDate().toString() ?? ''}
            />
            <input
              class={Styles.NewEventFieldTime}
              type="time"
              name="untilTime"
              value={props.event()?.until.toPlainTime().toString() ?? ''}
            />
          </div>
        </div>
      </div>
      <div
        classList={classList([
          PopoverStyles.PopoverContent,
          Styles.NewEventButtons,
        ])}
      >
        <button
          type="button"
          classList={classList([
            Styles.NewEventButton,
            Styles.NewEventButtonCancel,
          ])}
          onClick={props.onClose}
        >
          Cancel
        </button>
        <button
          type="button"
          class={Styles.NewEventButton}
          onClick={props.onICalClick}
        >
          iCal
        </button>
        <button
          type="button"
          class={Styles.NewEventButton}
          onClick={props.onGoogleClick}
        >
          Google
        </button>
      </div>
    </form>
  );
}
