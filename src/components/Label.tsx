import React, { ReactNode } from 'react';

import { Text, TruncationModes } from '~/ui';

interface Props {
  children: string;
  useMnemonic?: boolean;
}

export function Label({ children: label, useMnemonic = true }: Props) {
  if (!useMnemonic) {
    return <>{label}</>;
  }

  let buffer = '';
  const result: ReactNode[] = [];

  for (let i = 0; i <= label.length; i++) {
    let char = label[i];
    let finished = char === undefined;
    let mnemonic = false;

    if (char === '&') {
      i++;
      char = label[i];
      finished = char === undefined;
      mnemonic = true;
    }

    if (buffer.length > 0 && (mnemonic || finished)) {
      result.push(buffer);
      buffer = '';
    }

    if (mnemonic && !finished) {
      result.push(<u key={char}>{char}</u>);
    } else if (!finished) {
      buffer += char;
    }
  }

  return <Text truncationMode={TruncationModes.tail}>{result}</Text>;
}
