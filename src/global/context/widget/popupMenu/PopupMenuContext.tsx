import { createContext } from 'react';

interface IPopupMenuContext {
   setPMOpenerPos: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
   setPMIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
   setPMWidthPx: React.Dispatch<React.SetStateAction<number>>;
   setPMHeightPx: React.Dispatch<React.SetStateAction<number>>;
   setPMContent: React.Dispatch<React.SetStateAction<JSX.Element>>;
}

export const PopupMenuContext = createContext<IPopupMenuContext>({
   setPMOpenerPos: () => {},
   setPMIsOpen: () => {},
   setPMWidthPx: () => {},
   setPMHeightPx: () => {},
   setPMContent: () => {},
});
