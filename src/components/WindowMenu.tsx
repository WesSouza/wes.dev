import React, { useCallback, useRef } from 'react';

import { Scale, ZIndexes } from '~/constants/Styles';
import { useClickOutside } from '~/hooks/useClickOutside';
import { useMenu } from '~/hooks/useMenu';
import { HStack } from '~/ui';

import { Menu, MenuTree } from './Menu';
import { MenuItem } from './MenuItem';

interface Props {
  menu: MenuTree[];
  onMenuSelect: (action: string | null) => void;
}

export function WindowMenu({ menu, onMenuSelect }: Props) {
  const handleCancelRef = useRef<(() => void) | null>(null);

  const handleMenuSelect = useCallback(
    (action: string | null) => {
      handleCancelRef.current?.();
      onMenuSelect(action);
    },
    [onMenuSelect],
  );

  const {
    activeMenu,
    subMenu,
    subMenuPosition,
    handleCancel,
    handleSelect,
  } = useMenu({
    onMenuItemSelect: handleMenuSelect,
  });
  handleCancelRef.current = handleCancel;

  const { elementRef } = useClickOutside<HTMLDivElement>({
    onClickOutside: handleCancelRef.current,
  });

  const renderMenu = useCallback(
    (menuItem: MenuTree, index: number) => {
      return (
        <MenuItem
          active={menuItem === activeMenu}
          key={menuItem[0] + index}
          menuItem={menuItem}
          onSelect={handleSelect}
          vertical={true}
          windowMenu
        />
      );
    },
    [activeMenu, handleSelect],
  );

  return (
    <HStack
      nativeRef={elementRef}
      padding={Scale}
      shrink={0}
      zIndex={ZIndexes.windowMenus}
    >
      {menu.map(renderMenu)}
      {subMenu && (
        <Menu
          menu={subMenu}
          onMenuSelect={handleMenuSelect}
          position={subMenuPosition}
        ></Menu>
      )}
    </HStack>
  );
}
