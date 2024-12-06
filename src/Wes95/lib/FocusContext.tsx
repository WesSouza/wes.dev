import {
  createContext,
  createSignal,
  type Accessor,
  type ParentProps,
} from 'solid-js';

export type FocusContextState = {
  activeFocusId: Accessor<string | undefined>;
  setFocusId: (focusId: string | undefined) => void;
};

export const FocusContext = createContext<FocusContextState>();

export function FocusProvider(p: ParentProps) {
  const [focusId, setFocusId] = createSignal<string | undefined>();
  return (
    <FocusContext.Provider
      value={{
        activeFocusId: focusId,
        setFocusId,
      }}
    >
      {p.children}
    </FocusContext.Provider>
  );
}
