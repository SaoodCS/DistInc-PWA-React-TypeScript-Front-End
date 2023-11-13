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
   slide2Data: NDist.IAnalytics | NDist.IDistMsgs | NDist.ISavingsAccHist | null;
   setSlide2Data: SetValue<NDist.IAnalytics | NDist.IDistMsgs | NDist.ISavingsAccHist | null>;
   slideName: NDist.Carousel.ISlide2NameOptions | NDist.Carousel.ISlide1Name;
   setSlideName: SetValue<NDist.Carousel.ISlide2NameOptions | NDist.Carousel.ISlide1Name>;
   distStepsCompleted: number;
   setDistStepsCompleted: SetValue<number>;
}

export const DistributeContext = createContext<IDistributeContext>({
   carouselContainerRef: {} as React.RefObject<HTMLDivElement>,
   scrollToSlide: () => {},
   currentSlide: 1,
   handleItemClick: () => {},
   slide2Data: null,
   setSlide2Data: () => {},
   slideName: 'history',
   setSlideName: () => {},
   distStepsCompleted: 0,
   setDistStepsCompleted: () => {},
});
