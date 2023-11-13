import { createContext } from 'react';
import type { SetValue } from '../../../../global/hooks/useSessionStorage';
import type NDist from '../namespace/NDist';

export interface IDistributeContext {
   carouselContainerRef: React.RefObject<HTMLDivElement>;
   scrollToSlide: (slideNumber: number) => void;
   currentSlide: number;
   handleItemClick: (
      item: NDist.IAnalytics | NDist.IDistMsgs | NDist.ISavingsAccHist,
      itemType: NDist.Carousel.ISlide2NameOptions,
   ) => void;
   slide2Data: NDist.IAnalytics | NDist.IDistMsgs | NDist.ISavingsAccHist | undefined;
   setSlide2Data: SetValue<NDist.IAnalytics | NDist.IDistMsgs | NDist.ISavingsAccHist | undefined>;
   slideName: NDist.Carousel.ISlide2NameOptions | NDist.Carousel.ISlide1Name;
   setSlideName: SetValue<NDist.Carousel.ISlide2NameOptions | NDist.Carousel.ISlide1Name>;
   distCompletedStepNo: number;
   setDistCompletedStepNo: SetValue<number>;
}

export const DistributeContext = createContext<IDistributeContext>({
   carouselContainerRef: {} as React.RefObject<HTMLDivElement>,
   scrollToSlide: () => {},
   currentSlide: 1,
   handleItemClick: () => {},
   slide2Data: undefined,
   setSlide2Data: () => {},
   slideName: 'history',
   setSlideName: () => {},
   distCompletedStepNo: 0,
   setDistCompletedStepNo: () => {},
});
