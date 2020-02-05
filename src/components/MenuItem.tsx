import React, { useCallback, useRef, useState } from 'react';

import { ObjectPosition } from '~/constants/CommonTypes';
import { Icons, IconSrcs, IconSizes } from '~/constants/Icons';
import { Colors, Scale } from '~/constants/Styles';
import { Symbols } from '~/constants/Symbols';
import { Divider, HStack, Pressable, Spacer, Text, Themes } from '~/ui';
import { getOffsetRect } from '~/utils/dom';

import { Icon } from './Icon';
import { Label } from './Label';
import { MenuTree } from './Menu';
import { Symbol } from './Symbol';

function isIcon(
  iconOrString: string | Icons | undefined,
): iconOrString is Icons {
  return iconOrString ? iconOrString in IconSrcs : false;
}

interface Props {
  active: boolean;
  menuItem: MenuTree | null;
  onSelect: (options: {
    menu: MenuTree | null;
    position: ObjectPosition;
  }) => void;
  vertical: boolean;
  windowMenu?: boolean;
}

export function MenuItem({
  active,
  menuItem,
  onSelect,
  vertical,
  windowMenu,
}: Props) {
  const button = useRef<HTMLButtonElement>(null);
  const [hovering, setHovering] = useState(false);

  const handlePointerEnter = useCallback(() => {
    setHovering(true);
  }, []);
  const handlePointerLeave = useCallback(() => {
    setHovering(false);
  }, []);
  const handlePress = useCallback(() => {
    if (!button.current) {
      return;
    }

    const rect = getOffsetRect(button.current);
    const position = vertical
      ? { x: rect.x, y: rect.y + rect.height }
      : { x: rect.x + rect.width, y: rect.y - Scale * 3 };
    onSelect({
      menu: menuItem,
      position,
    });
  }, [menuItem, onSelect, vertical]);

  let disabled = false;

  if (menuItem === null) {
    active = false;
    disabled = true;
    menuItem = ['(Empty)', ''];
  }

  if (menuItem.length === 1) {
    return <Divider />;
  }

  const [label, subMenu, shortcutOrIcon] = menuItem;
  const activeOrHover = active || (hovering && !windowMenu);
  const hasSubMenuGlyph = !windowMenu && Array.isArray(subMenu);
  const icon = isIcon(shortcutOrIcon);

  if (subMenu === 'disabled') {
    disabled = true;
  }

  return (
    <Pressable
      backgroundColor={activeOrHover ? Colors.blue : undefined}
      foregroundColor={activeOrHover && !disabled ? Colors.white : undefined}
      marginBottom={Scale}
      nativeRef={button}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPress={handlePress}
      paddingBottom={Scale * (windowMenu ? 0 : 2)}
      paddingLeading={Scale * 6}
      paddingTop={Scale * (windowMenu ? 2 : 2)}
      paddingTrailing={Scale * 6}
      theme={disabled ? Themes.disabled : undefined}
    >
      <HStack>
        {shortcutOrIcon && icon ? (
          <Icon
            icon={shortcutOrIcon as Icons}
            marginTrailing={Scale * 5}
            size={IconSizes.small}
          />
        ) : !windowMenu ? (
          <Spacer minLength={Scale * 12} />
        ) : null}
        <Label>{label}</Label>
        <Spacer />
        {!icon && shortcutOrIcon && (
          <Text marginLeading={Scale * 20}>{shortcutOrIcon}</Text>
        )}
        {hasSubMenuGlyph ? (
          <Symbol marginLeading={Scale * 12} symbol={Symbols.chevronRight} />
        ) : !windowMenu ? (
          <Spacer minLength={Scale * 12} />
        ) : null}
      </HStack>
    </Pressable>
  );
}
