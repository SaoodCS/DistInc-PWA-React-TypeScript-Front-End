import type { ReactNode } from 'react';
import { useState } from 'react';
import Banner from '../../../components/lib/banner/Banner';
import useFuncState from '../../../hooks/useFuncState';
import type { IBannerType } from './BannerContext';
import { BannerContext } from './BannerContext';

interface IBannerContextProvider {
   children: ReactNode;
}

export const BannerContextProvider = (props: IBannerContextProvider): JSX.Element => {
   const { children } = props;
   const [showBanner, setShowBanner] = useState(false);
   const [bannerMessage, setBannerMessage] = useState('');
   const [handleBannerClick, setHandleBannerClick] = useFuncState(() => null);
   const [BannerIcon, setBannerIcon] = useState<ReactNode>(undefined);
   const [bannerHeightEm, setBannerHeightEm] = useState(5);
   const [bannerZIndex, setBannerZIndex] = useState<number | undefined>(undefined);
   const [bannerType, setBannerType] = useState<IBannerType>('default');

   function onClose(): void {
      setShowBanner(false);
      setBannerIcon(undefined);
      setBannerMessage('');
      setHandleBannerClick(() => null);
      setBannerZIndex(undefined);
      setBannerType('default');
   }

   return (
      <>
         <BannerContext.Provider
            value={{
               showBanner,
               setShowBanner,
               bannerMessage,
               setBannerMessage,
               setHandleBannerClick,
               setBannerIcon,
               setBannerHeightEm,
               bannerZIndex,
               setBannerZIndex,
               setBannerType,
            }}
         >
            {children}
         </BannerContext.Provider>
         <Banner
            message={bannerMessage}
            handleClick={handleBannerClick}
            isVisible={showBanner}
            Icon={BannerIcon ? BannerIcon : undefined}
            onClose={onClose}
            heightEm={bannerHeightEm}
            zIndex={bannerZIndex}
            bannerType={bannerType}
         />
      </>
   );
};
