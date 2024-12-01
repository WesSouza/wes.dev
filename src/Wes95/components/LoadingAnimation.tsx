import { WES95_SYSTEM_PATH } from '../../config';
import { createEffect, createSignal } from 'solid-js';
import { getRandomNumber } from '../utils/random';
import styles from './LoadingAnimation.module.css';
import { ScreenManager } from '../lib/ScreenManager';

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

export function LoadingAnimation() {
  const [size, setSize] = createSignal<
    { width: number; height: number } | undefined
  >(undefined);

  const iconIndex = getRandomNumber(0, AnimationIcons.length - 1);
  const icon = AnimationIcons[iconIndex]!;

  createEffect(() => {
    const scale = ScreenManager.shared.scale();
    setSize({ width: icon.width * scale, height: icon.height * scale });
  });

  return (
    <div class={styles.Animation}>
      <img
        src={WES95_SYSTEM_PATH + '/animation' + icon.animation + '.gif'}
        style={{ width: `${size()?.width}px`, height: `${size()?.height}px` }}
      />
    </div>
  );
}
