import { useCallback, useEffect, useState, useRef } from 'react';

function iWroteThisFunctionOneThousandTimesInMyCareerAtLeastWeHavePadStartNow(
  date: Date,
) {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  let amPm = 'AM';

  if (hours === 0) {
    hours = 12;
  } else if (hours === 12) {
    amPm = 'PM';
  } else if (hours > 12) {
    hours -= 12;
    amPm = 'PM';
  }

  return `${hours}:${String(minutes).padStart(2, '0')} ${amPm}`;
}

export function useClock() {
  const timer = useRef<number | null>(null);
  const [clock, setClock] = useState('');

  const tickTock = useCallback(() => {
    const now = new Date();
    setClock(
      iWroteThisFunctionOneThousandTimesInMyCareerAtLeastWeHavePadStartNow(now),
    );
  }, []);

  useEffect(() => {
    tickTock();
    timer.current = window.setInterval(tickTock, 1000);

    return () => {
      if (timer.current) {
        window.clearInterval(timer.current);
      }
    };
  }, [tickTock]);

  return clock;
}
