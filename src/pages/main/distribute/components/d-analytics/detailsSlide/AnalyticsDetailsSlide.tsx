import { useQueryClient } from '@tanstack/react-query';
import { useContext } from 'react';
import { CardWidgetWrapper } from '../../../../../../global/components/lib/card/Card';
import { CarouselAndNavBarWrapper } from '../../../../../../global/components/lib/carousel/NavBar';
import { TextColourizer } from '../../../../../../global/components/lib/font/textColorizer/TextColourizer';
import { TrashIcon } from '../../../../../../global/components/lib/icons/delete/TrashIcon';
import { FlexColumnWrapper } from '../../../../../../global/components/lib/positionModifiers/flexColumnWrapper/FlexColumnWrapper';
import { FlexRowWrapper } from '../../../../../../global/components/lib/positionModifiers/flexRowWrapper/Style';
import useThemeContext from '../../../../../../global/context/theme/hooks/useThemeContext';
import microservices from '../../../../../../global/firebase/apis/microservices/microservices';
import ArrayOfObjects from '../../../../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import BoolHelper from '../../../../../../global/helpers/dataTypes/bool/BoolHelper';
import NumberHelper from '../../../../../../global/helpers/dataTypes/number/NumberHelper';
import { DistributeContext } from '../../../context/DistributeContext';
import NDist from '../../../namespace/NDist';
import _Date from '../../../../../../global/helpers/dataTypes/date/_Date';

export default function AnalyticsDetailsSlide(): JSX.Element {
   const { slide2Data } = useContext(DistributeContext);
   const analyticsItem = slide2Data as NDist.IAnalytics;
   const { isDarkTheme } = useThemeContext();
   const { scrollToSlide } = useContext(DistributeContext);

   const queryClient = useQueryClient();
   const delCalcDistItemInFirestore = NDist.API.useMutation.delCalcDist({
      onSuccess: () => {
         // eslint-disable-next-line @typescript-eslint/no-floating-promises
         queryClient.invalidateQueries({ queryKey: [microservices.getCalculations.name] });
         scrollToSlide(1);
      },
   });

   async function handleDelete(): Promise<void> {
      await delCalcDistItemInFirestore.mutateAsync({
         type: 'analyticsItem',
         data: analyticsItem,
      });
   }

   function analyticsMapArray(): NDist.Carousel.IAnalyticsDetails[] {
      const analyticsObj = ArrayOfObjects.getObj(NDist.Carousel.slides, 'name', 'analytics');
      const mapArray = analyticsObj?.mapArr as NDist.Carousel.IMapArrFunc;
      return mapArray(analyticsItem, isDarkTheme);
   }

   return (
      <CarouselAndNavBarWrapper style={{ width: '100%' }}>
         <FlexRowWrapper padding="2em">
            <TextColourizer fontSize="2em" bold padding="0em 0.25em 0em 0em">
               {_Date.DDMMYYYY.toWord(analyticsItem.timestamp)}
            </TextColourizer>
            <TrashIcon
               darktheme={BoolHelper.boolToStr(isDarkTheme)}
               height={'1.5em'}
               onClick={() => handleDelete()}
            />
         </FlexRowWrapper>

         <FlexColumnWrapper padding="0em 2em 1em 2em">
            {analyticsMapArray().map((item) => (
               <CardWidgetWrapper bgColor={item.color} height={item.cardHeight} key={item.key}>
                  <FlexColumnWrapper height={'100%'} justifyContent="center" padding="0em 1em">
                     <TextColourizer fontSize="1.25em" bold padding={'0.25em 0em'}>
                        {item.title}
                     </TextColourizer>

                     <TextColourizer fontSize="0.9em">
                        {NumberHelper.asCurrencyStr(item.data as number)}
                     </TextColourizer>
                  </FlexColumnWrapper>
                  <FlexColumnWrapper height={'100%'} justifyContent="center" padding={'0em 0.5em'}>
                     {item.icon}
                  </FlexColumnWrapper>
               </CardWidgetWrapper>
            ))}
         </FlexColumnWrapper>
      </CarouselAndNavBarWrapper>
   );
}
