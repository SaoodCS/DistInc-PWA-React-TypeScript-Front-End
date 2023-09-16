import type { Dispatch, ReactNode, SetStateAction } from 'react';
import { createContext } from 'react';

interface IBannerContext {
   showBanner: boolean;
   setShowBanner: Dispatch<SetStateAction<boolean>>;
   bannerMessage: string;
   setBannerMessage: Dispatch<SetStateAction<string>>;
   setHandleBannerClick: Dispatch<SetStateAction<() => void>>;
   setBannerIcon: Dispatch<SetStateAction<ReactNode>>;
   setBannerHeightEm: Dispatch<SetStateAction<number>>;
}

export const BannerContext = createContext<IBannerContext>({
   showBanner: false,
   setShowBanner: () => {},
   bannerMessage: '',
   setBannerMessage: () => {},
   setHandleBannerClick: () => {},
   setBannerIcon: () => {},
   setBannerHeightEm: () => {},
});
