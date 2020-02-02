/** @jsx jsx */
import { jsx } from '@emotion/core';

interface Menu {
  [name: string]: string | Menu;
}

interface Props {
  menu: Menu;
  onMenuSelect: () => void;
}

export function WindowMenu({}: Props) {
  return <div></div>;
}
