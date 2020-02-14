import { useCallback, useState } from 'react';

import { MenuTree } from '~/components';
import { ObjectPosition } from '~/constants/CommonTypes';

export function useMenu({
  onMenuItemSelect,
}: {
  onMenuItemSelect?: (action: string | null) => void;
} = {}) {
  const [activeMenu, setActiveMenu] = useState<MenuTree | null>(null);
  const [subMenu, setSubMenu] = useState<MenuTree[] | null>(null);
  const [subMenuPosition, setSubMenuPosition] = useState<ObjectPosition | null>(
    null,
  );

  const handleCancel = useCallback(() => {
    setActiveMenu(null);
    setSubMenu(null);
    setSubMenuPosition(null);
  }, [setActiveMenu, setSubMenu, setSubMenuPosition]);

  const handleSelect = useCallback(
    ({
      menu,
      position,
    }: {
      menu: MenuTree | null;
      position: ObjectPosition;
    }) => {
      if (activeMenu === menu || !menu) {
        handleCancel();
        return;
      }

      if (Array.isArray(menu[1])) {
        setActiveMenu(menu);
        setSubMenu(menu[1]);
        setSubMenuPosition(position);
        return;
      }

      if (typeof menu[1] === 'string') {
        handleCancel();
        onMenuItemSelect?.(menu[1]);
      }
    },
    [activeMenu, handleCancel, onMenuItemSelect],
  );

  return {
    activeMenu,
    subMenu,
    subMenuPosition,
    handleCancel,
    handleSelect,
  };
}
