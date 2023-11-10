import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import useCarousel from '../../../../global/components/lib/carousel/hooks/useCarousel';
import useHeaderContext from '../../../../global/context/widget/header/hooks/useHeaderContext';
import useSessionStorage from '../../../../global/hooks/useSessionStorage';
import NDist from '../namespace/NDist';
import { DistributeContext } from './DistributeContext';

interface IDistributeContextProvider {
   children: ReactNode;
}

export default function DistributeContextProvider(props: IDistributeContextProvider): JSX.Element {
   const { children } = props;
   const location = useLocation();
   const {
      containerRef: carouselContainerRef,
      scrollToSlide,
      currentSlide,
      setCurrentSlide,
   } = useCarousel(1, NDist.Carousel.key.currentSlideNo);
   const { setHandleBackBtnClick, hideAndResetBackBtn, setHeaderTitle } =
      useHeaderContext();
   const [slide2Data, setSlide2Data] = useState<
      NDist.IAnalytics | NDist.IDistMsgs | NDist.ISavingsAccHist | undefined
   >(undefined);
   const [slideName, setSlideName] = useSessionStorage<
      NDist.Carousel.ISlide2NameOptions | NDist.Carousel.ISlide1Name
   >(NDist.Carousel.key.currentSlideName, 'history');

   function handleItemClick(
      item: NDist.IAnalytics | NDist.IDistMsgs | NDist.ISavingsAccHist,
      itemType: NDist.Carousel.ISlide2NameOptions,
   ): void {
      setSlideName(itemType);
      scrollToSlide(2);
      setSlide2Data(item);
   }

   return (
      <DistributeContext.Provider
         value={{
            carouselContainerRef,
            scrollToSlide,
            currentSlide,
            handleItemClick,
            slide2Data,
            setSlide2Data,
            slideName,
            setSlideName,
         }}
      >
         {children}
      </DistributeContext.Provider>
   );
}
