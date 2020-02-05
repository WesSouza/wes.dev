import React, { RefObject, useCallback } from 'react';

import { ObjectPosition } from '~/constants/CommonTypes';
import { Icons } from '~/constants/Icons';
import { Scale } from '~/constants/Styles';
import { useMenu } from '~/hooks/useMenu';
import { HorizontalAlignments, Themes, VStack } from '~/ui';

import { MenuItem } from './MenuItem';

export type MenuTree =
  | [string, MenuTree[]]
  | [string, MenuTree[], Icons]
  | [string, string]
  | [string, string, string]
  | [string, string, Icons]
  | ['-'];

interface Props {
  menu: MenuTree[];
  nativeRef?: RefObject<HTMLDivElement>;
  onMenuSelect: (action: string | null) => void;
  position: ObjectPosition | null;
}

export function Menu({ menu, nativeRef, onMenuSelect, position }: Props) {
  const { activeMenu, subMenu, subMenuPosition, handleSelect } = useMenu({
    onMenuItemSelect: onMenuSelect,
  });

  const renderMenu = useCallback(
    (menuItem: MenuTree | null, index: number) => {
      const key = menuItem ? menuItem[0] + index : index;
      return (
        <MenuItem
          active={menuItem === activeMenu}
          key={key}
          menuItem={menuItem}
          onSelect={handleSelect}
          vertical={false}
        />
      );
    },
    [activeMenu, handleSelect],
  );

  return (
    <VStack
      alignment={HorizontalAlignments.stretch}
      invertX={position?.invertX}
      invertY={position?.invertY}
      nativeRef={nativeRef}
      padding={Scale * 1}
      theme={Themes.frame}
      x={position?.x}
      y={position?.y}
    >
      {menu.map(renderMenu)}
      {menu.length === 0 && renderMenu(null, 0)}
      {subMenu && (
        <Menu
          onMenuSelect={onMenuSelect}
          menu={subMenu}
          position={subMenuPosition}
        ></Menu>
      )}
    </VStack>
  );
}
