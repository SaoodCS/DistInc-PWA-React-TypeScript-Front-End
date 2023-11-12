import { useQueryClient } from '@tanstack/react-query';
import { Fragment, useContext, useEffect } from 'react';
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
import DateHelper from '../../../../../../global/helpers/dataTypes/date/DateHelper';
import NumberHelper from '../../../../../../global/helpers/dataTypes/number/NumberHelper';
import useSessionStorage from '../../../../../../global/hooks/useSessionStorage';
import { DistributeContext } from '../../../context/DistributeContext';
import NDist from '../../../namespace/NDist';

export default function AnalyticsDetailsSlide(): JSX.Element {
   const { slide2Data } = useContext(DistributeContext);
   const analyticsItem = slide2Data as NDist.IAnalytics;
   const [prevAnalyticsItem, setPrevAnalyticsItem] = useSessionStorage(
      'prevAnalyticsItem',
      analyticsItem,
   );
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

   useEffect(() => {
      if (analyticsItem) {
         setPrevAnalyticsItem(analyticsItem);
      }
   }, []);

   function analyticsToRender(): NDist.IAnalytics {
      if (!analyticsItem) return prevAnalyticsItem;
      return analyticsItem;
   }

   async function handleDelete(): Promise<void> {
      await delCalcDistItemInFirestore.mutateAsync({
         type: 'analyticsItem',
         data: analyticsToRender(),
      });
   }

   function analyticsMapArray(): NDist.Carousel.IAnalyticsDetails[] {
      const analyticsObj = ArrayOfObjects.getObjWithKeyValuePair(
         NDist.Carousel.slides,
         'name',
         'analytics',
      );
      const mapArray = analyticsObj?.mapArr as NDist.Carousel.IMapArrFunc;
      return mapArray(analyticsToRender(), isDarkTheme);
   }

   return (
      <CarouselAndNavBarWrapper style={{ width: '100%' }}>
         <FlexRowWrapper padding="2em">
            <TextColourizer fontSize="2em" bold padding="0em 0.25em 0em 0em">
               {DateHelper.fromDDMMYYYYToWord(analyticsToRender().timestamp)}
            </TextColourizer>
            <TrashIcon
               darktheme={BoolHelper.toString(isDarkTheme)}
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
                     {item.key !== 'prevMonth' && (
                        <TextColourizer fontSize="0.9em">
                           {NumberHelper.asCurrencyStr(item.data as number)}
                        </TextColourizer>
                     )}
                     {item.key === 'prevMonth' && (
                        <Fragment>
                           {(item.data as NDist.Carousel.IPrevMonthData[]).map((data) => (
                              <TextColourizer fontSize="0.85em" padding="0.1em 0em" key={data.key}>
                                 <TextColourizer bold>{data.title}</TextColourizer>
                                 {NumberHelper.asCurrencyStr(data.data)}
                              </TextColourizer>
                           ))}
                        </Fragment>
                     )}
                  </FlexColumnWrapper>
                  <FlexColumnWrapper
                     height={'100%'}
                     justifyContent="center"
                     padding={item.key === 'prevMonth' ? '0em 0em' : '0em 0.5em'}
                  >
                     {item.icon}
                  </FlexColumnWrapper>
               </CardWidgetWrapper>
            ))}
         </FlexColumnWrapper>
      </CarouselAndNavBarWrapper>
   );
}
