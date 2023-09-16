import type { Dispatch, SetStateAction } from 'react';
import { createContext } from 'react';

interface IBottomPanelContext {
   setIsBottomPanelOpen: Dispatch<SetStateAction<boolean>>;
   setBottomPanelContent: Dispatch<SetStateAction<JSX.Element>>;
   setBottomPanelHeading: Dispatch<SetStateAction<string | undefined>>;
   setBottomPanelHeightDvh: Dispatch<SetStateAction<number | undefined>>;
   bottomPanelContent: JSX.Element;
}

export const BottomPanelContext = createContext<IBottomPanelContext>({
   setIsBottomPanelOpen: () => {},
   setBottomPanelContent: () => {},
   bottomPanelContent: <></>,
   setBottomPanelHeading: () => {},
   setBottomPanelHeightDvh: () => {},
});
