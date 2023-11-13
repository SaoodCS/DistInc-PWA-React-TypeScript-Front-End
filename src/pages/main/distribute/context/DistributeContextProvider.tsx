import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import useCarousel from '../../../../global/components/lib/carousel/hooks/useCarousel';
import FooterHooks from '../../../../global/context/widget/footer/hooks/FooterHooks';
import useFooterContext from '../../../../global/context/widget/footer/hooks/useFooterContext';
import HeaderHooks from '../../../../global/context/widget/header/hooks/HeaderHooks';
import useHeaderContext from '../../../../global/context/widget/header/hooks/useHeaderContext';
import ArrayOfObjects from '../../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import useSessionStorage from '../../../../global/hooks/useSessionStorage';
import NDist from '../namespace/NDist';
import { DistributeContext } from './DistributeContext';

interface IDistributeContextProvider {
   children: ReactNode;
}

export default function DistributeContextProvider(props: IDistributeContextProvider): JSX.Element {
   const { children } = props;
   HeaderHooks.useOnUnMount.resetHeaderRightEl();
   HeaderHooks.useOnUnMount.hideAndResetBackBtn();
   const {
      containerRef: carouselContainerRef,
      scrollToSlide,
      currentSlide,
      setCurrentSlide,
   } = useCarousel(1, NDist.Carousel.key.currentSlideNo);
   const [slide2Data, setSlide2Data] = useSessionStorage<
      NDist.IAnalytics | NDist.IDistMsgs | NDist.ISavingsAccHist | undefined
   >('distributerCarousel.slide2Data', undefined);
   const [slideName, setSlideName] = useSessionStorage<
      NDist.Carousel.ISlide2NameOptions | NDist.Carousel.ISlide1Name
   >(
      NDist.Carousel.key.currentSlideName,
      ArrayOfObjects.getObjWithKeyValuePair(NDist.Carousel.slides, 'slideNo', 1).name,
   );
   const [distCompletedStepNo, setDistCompletedStepNo] = useSessionStorage<number>(
      'distributerCarousel.distCompletedStepNo',
      0,
   );

   FooterHooks.useOnUnMount.resetFooterItemSecondClick();
   const { setHandleBackBtnClick, hideAndResetBackBtn, setHeaderTitle } = useHeaderContext();
   const { setHandleFooterItemSecondClick, resetFooterItemSecondClick } = useFooterContext();

   useEffect(() => {
      const slideTitle = NDist.Carousel.getSlideTitle(slideName);
      setHeaderTitle(slideTitle);
      const isSlideNameHistory = slideName === 'history';
      const isCurrentSlide1 = currentSlide === 1;
      if (!isSlideNameHistory) {
         if (isCurrentSlide1) setCurrentSlide(2);
         setHandleBackBtnClick(() => scrollToSlide(1));
         setHandleFooterItemSecondClick(() => scrollToSlide(1));
      }
      if (isSlideNameHistory) {
         if (!isCurrentSlide1) setCurrentSlide(1);
         hideAndResetBackBtn();
         resetFooterItemSecondClick();
         setSlide2Data(undefined);
         setDistCompletedStepNo(0);
      }
   }, [slideName]);

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
            distCompletedStepNo,
            setDistCompletedStepNo,
         }}
      >
         {children}
      </DistributeContext.Provider>
   );
}
