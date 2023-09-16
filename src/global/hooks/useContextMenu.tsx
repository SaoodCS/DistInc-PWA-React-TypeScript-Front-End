import { useRef, useState } from 'react';

interface IUseContextMenuReturnType {
   buttonRef: React.RefObject<HTMLButtonElement>;
   showMenu: boolean;
   toggleMenu: () => void;
   setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function useContextMenu(): IUseContextMenuReturnType {
   const buttonRef = useRef<HTMLButtonElement>(null);
   const [showMenu, setShowMenu] = useState(false);

   function toggleMenu(): void {
      setShowMenu(!showMenu);
   }

   return {
      buttonRef,
      showMenu,
      toggleMenu,
      setShowMenu,
   };
}
