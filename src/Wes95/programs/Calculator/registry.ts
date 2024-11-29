import { z } from 'zod';
import { CalculatorMainWindow } from './MainWindow';

export const CalculatorMainDataSchema = z.object({
  number: z.number().optional(),
});

export type CalculatorMainData = z.infer<typeof CalculatorMainDataSchema>;

export function registerCalculator() {
  return {
    name: 'Calculator',
    windows: {
      Main: {
        schema: CalculatorMainDataSchema,
        window: CalculatorMainWindow,
      },
    },
  };
}
