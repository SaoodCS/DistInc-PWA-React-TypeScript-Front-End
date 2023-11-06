import { createContext } from 'react';

interface IPopupMenuContext {
   setPMIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
   setPMWidthPx: React.Dispatch<React.SetStateAction<number>>;
   setPMHeightPx: React.Dispatch<React.SetStateAction<number>>;
   setPMContent: React.Dispatch<React.SetStateAction<JSX.Element>>;
   setClickEvent: React.Dispatch<
      React.SetStateAction<React.MouseEvent<HTMLButtonElement | HTMLDivElement | SVGSVGElement, MouseEvent>>
   >;
}

export const PopupMenuContext = createContext<IPopupMenuContext>({
   setPMIsOpen: () => {},
   setPMWidthPx: () => {},
   setPMHeightPx: () => {},
   setPMContent: () => {},
   setClickEvent: () => {},
});
