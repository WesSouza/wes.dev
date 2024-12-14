import { createEffect, createMemo, createSignal } from 'solid-js';
import { WES95_SYSTEM_PATH } from '../../config';
import { ScreenManager } from '../lib/ScreenManager';
import { getRandomNumber } from '../utils/random';
import styles from './LoadingAnimation.module.css';

const AnimationIcons = [
  { animation: 'ComputerSend', width: 104, height: 34 },
  { animation: 'DocumentPuzzle', width: 48, height: 44 },
  { animation: 'Flashlight', width: 80, height: 50 },
  { animation: 'Globe', width: 48, height: 45 },
  { animation: 'MagnifyingComputer', width: 48, height: 45 },
  { animation: 'MagnifyingDocument', width: 48, height: 50 },
  { animation: 'PaperFold', width: 64, height: 42 },
  { animation: 'PhoneDial', width: 32, height: 32 },
];

export function LoadingAnimation(p: { animation?: string }) {
  const [size, setSize] = createSignal<
    { width: number; height: number } | undefined
  >(undefined);

  const icon = createMemo(() => {
    if (p.animation) {
      return AnimationIcons.find((icon) => icon.animation === p.animation);
    }

    const iconIndex = getRandomNumber(0, AnimationIcons.length - 1);
    return AnimationIcons[iconIndex]!;
  });

  createEffect(() => {
    const scale = ScreenManager.shared.scale();
    const iconValue = icon();
    if (iconValue) {
      setSize({
        width: iconValue.width * scale,
        height: iconValue.height * scale,
      });
    }
  });

  return (
    <div class={styles.Animation}>
      <img
        src={WES95_SYSTEM_PATH + '/animation' + icon()!.animation + '.gif'}
        style={{ width: `${size()?.width}px`, height: `${size()?.height}px` }}
      />
    </div>
  );
}
