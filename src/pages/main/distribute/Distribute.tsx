import { useContext, useState } from 'react';
import { CarouselContainer, CarouselSlide } from '../../../global/components/lib/carousel/Carousel';
import ConditionalRender from '../../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import AnalyticsDetailsSlide from './components/d-analytics/detailsSlide/AnalyticsDetailsSlide';
import DistMsgsDetailsSlide from './components/d-distMsgs/detailsSlide/DistMsgsDetailsSlide';
import SavingsAccHistDetailsSlide from './components/d-savingsHist/detailsSlide/SavingsAccHistDetailsSlide';
import HistorySlide from './components/historySlide/HistorySlide';
import { DistributeContext } from './context/DistributeContext';
import DistributeContextProvider from './context/DistributeContextProvider';

export default function Distribute(): JSX.Element {
   return (
      <DistributeContextProvider>
         <DistributePageTemplate />
      </DistributeContextProvider>
   );
}

function DistributePageTemplate(): JSX.Element {
   const { carouselContainerRef, slideName, setSlideName } = useContext(DistributeContext);
   const [prevScrollPos, setPrevScrollPos] = useState<number>(0);

   function handleScroll(): void {
      const currentLeftScroll = carouselContainerRef.current?.scrollLeft;
      if (currentLeftScroll! < prevScrollPos && currentLeftScroll === 0) setSlideName('history');
      setPrevScrollPos(currentLeftScroll!);
   }

   return (
      <CarouselContainer
         ref={carouselContainerRef}
         onScroll={handleScroll}
         style={{ height: '100%' }}
      >
         <CarouselSlide height={'100%'}>
            <HistorySlide />
         </CarouselSlide>
         <CarouselSlide height={'100%'}>
            <ConditionalRender condition={'analytics' === slideName}>
               <AnalyticsDetailsSlide />
            </ConditionalRender>
            <ConditionalRender condition={'distributer' === slideName}>
               <DistMsgsDetailsSlide />
            </ConditionalRender>
            <ConditionalRender condition={'savingsAccHistory' === slideName}>
               <SavingsAccHistDetailsSlide />
            </ConditionalRender>
         </CarouselSlide>
      </CarouselContainer>
   );
}
