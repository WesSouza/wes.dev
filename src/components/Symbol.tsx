/** @jsx jsx */
import { jsx } from '@emotion/core';

import { Scale } from '~/constants/Styles';
import { Symbols, SymbolSvgs } from '~/constants/Symbols';
import { Image } from '~/ui';

const Size = 9 * Scale;

interface Props {
  symbol: Symbols;
}

export function Symbol({ symbol }: Props) {
  return <Image svg={SymbolSvgs[symbol]} width={Size} height={Size} />;
}
