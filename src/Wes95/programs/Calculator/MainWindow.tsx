import { onMount } from 'solid-js';
import { MenuBar } from '../../components/MenuBar';
import { WindowManager } from '../../lib/WindowManager';
import type { WindowState } from '../../models/WindowState';
import type { CalculatorMainData } from './registry';

export function CalculatorMainWindow(p: {
  data: CalculatorMainData;
  window: WindowState;
}) {
  onMount(() => {
    WindowManager.shared.init(p.window.id, {
      icon: 'iconCalculator',
      title: 'Calculator',
    });
  });

  const handleMenuSelect = (id: string) => {
    if (id === 'Exit') {
      WindowManager.shared.closeWindow(p.window.id);
    }
  };

  const handleBackspace = () => {};

  const handleClear = () => {};

  const handleClearEntry = () => {};

  const handleDivide = () => {};

  const handleEqual = () => {};

  const handleMemoryAdd = () => {};

  const handleMemoryClear = () => {};

  const handleMemoryRecall = () => {};

  const handleMemoryStore = () => {};

  const handleMultiply = () => {};

  const handleNumber = (_number: number) => {};

  const handleOneOverX = () => {};

  const handlePercentage = () => {};

  const handlePlusMinus = () => {};

  const handlePoint = () => {};

  const handleSqrt = () => {};

  const handleSubtract = () => {};

  const handleSum = () => {};

  return (
    <>
      <MenuBar
        items={[
          {
            type: 'item',
            id: 'Edit',
            label: 'Edit',
            submenu: [
              {
                type: 'item',
                id: 'Copy',
                label: 'Copy',
              },
              {
                type: 'item',
                id: 'Paste',
                label: 'Paste',
              },
            ],
          },
          {
            type: 'item',
            id: 'Help',
            label: 'Help',
            submenu: [
              {
                type: 'item',
                id: 'About',
                label: 'About Calculator',
              },
            ],
          },
        ]}
        onSelect={handleMenuSelect}
      />
      <hr class="HorizontalSeparator" />
      <div class="Vertical MediumSpacing SmallGap">
        <div class="Field">0.</div>
        <div class="Horizontal SmallSpacing MediumGap">
          <div class="Vertical SmallSpacing">
            <div class="Field"></div>
            <button type="button" class="Button" onClick={handleMemoryClear}>
              MC
            </button>
            <button type="button" class="Button" onClick={handleMemoryRecall}>
              MR
            </button>
            <button type="button" class="Button" onClick={handleMemoryStore}>
              MS
            </button>
            <button type="button" class="Button" onClick={handleMemoryAdd}>
              M+
            </button>
          </div>
          <div class="Vertical SmallSpacing">
            <div class="Horizontal SmallSpacing">
              <button type="button" class="Button" onClick={handleBackspace}>
                Back
              </button>
              <button type="button" class="Button" onClick={handleClearEntry}>
                CE
              </button>
              <button type="button" class="Button" onClick={handleClear}>
                C
              </button>
            </div>
            <div class="Horizontal SmallSpacing">
              <button
                type="button"
                class="Button"
                onClick={() => handleNumber(7)}
              >
                7
              </button>
              <button
                type="button"
                class="Button"
                onClick={() => handleNumber(8)}
              >
                8
              </button>
              <button
                type="button"
                class="Button"
                onClick={() => handleNumber(9)}
              >
                9
              </button>
              <button type="button" class="Button" onClick={handleDivide}>
                /
              </button>
              <button type="button" class="Button" onClick={handleSqrt}>
                sqrt
              </button>
            </div>
            <div class="Horizontal SmallSpacing">
              <button
                type="button"
                class="Button"
                onClick={() => handleNumber(4)}
              >
                4
              </button>
              <button
                type="button"
                class="Button"
                onClick={() => handleNumber(5)}
              >
                5
              </button>
              <button
                type="button"
                class="Button"
                onClick={() => handleNumber(6)}
              >
                6
              </button>
              <button type="button" class="Button" onClick={handleMultiply}>
                *
              </button>
              <button type="button" class="Button" onClick={handlePercentage}>
                %
              </button>
            </div>
            <div class="Horizontal SmallSpacing">
              <button
                type="button"
                class="Button"
                onClick={() => handleNumber(1)}
              >
                1
              </button>
              <button
                type="button"
                class="Button"
                onClick={() => handleNumber(2)}
              >
                2
              </button>
              <button
                type="button"
                class="Button"
                onClick={() => handleNumber(3)}
              >
                3
              </button>
              <button type="button" class="Button" onClick={handleSubtract}>
                -
              </button>
              <button type="button" class="Button" onClick={handleOneOverX}>
                1/x
              </button>
            </div>
            <div class="Horizontal SmallSpacing">
              <button
                type="button"
                class="Button"
                onClick={() => handleNumber(0)}
              >
                0
              </button>
              <button type="button" class="Button" onClick={handlePlusMinus}>
                +/-
              </button>
              <button type="button" class="Button" onClick={handlePoint}>
                .
              </button>
              <button type="button" class="Button" onClick={handleSum}>
                +
              </button>
              <button type="button" class="Button" onClick={handleEqual}>
                =
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
