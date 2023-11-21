import { useEffect, useState } from 'react';
import { CurrencyOnCardTxt } from '../../../../../global/components/lib/font/currencyOnCardText/CurrencyOnCardTxt';
import { TextColourizer } from '../../../../../global/components/lib/font/textColorizer/TextColourizer';
import { FlexColumnWrapper } from '../../../../../global/components/lib/positionModifiers/flexColumnWrapper/FlexColumnWrapper';
import useThemeContext from '../../../../../global/context/theme/hooks/useThemeContext';
import Color from '../../../../../global/css/colors';
import ArrayOfObjects from '../../../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import MiscHelper from '../../../../../global/helpers/dataTypes/miscHelper/MiscHelper';
import NumberHelper from '../../../../../global/helpers/dataTypes/number/NumberHelper';
import NDist from '../../../distribute/namespace/NDist';

export default function TotalIncome(): JSX.Element {
   const { isDarkTheme } = useThemeContext();
   const { data: calcDistData } = NDist.API.useQuery.getCalcDist();
   const [latestTotalIncome, setLatestTotalIncome] = useState<number>(0);

   useEffect(() => {
      const analytics = calcDistData?.analytics;
      if (MiscHelper.isNotFalsyOrEmpty(analytics)) {
         const orderedAnalytics = ArrayOfObjects.sortByDateStr(analytics, 'timestamp', true);
         const latestAnalytics = orderedAnalytics[0];
         setLatestTotalIncome(latestAnalytics.totalIncomes);
      }
   }, [calcDistData]);

   return (
      <FlexColumnWrapper
         padding="0em 1em 0em 1em"
         height="100%"
         width="100%"
         justifyContent="center"
      >
         <TextColourizer
            padding="0em 0em 1em 0em"
            color={Color.setRgbOpacity(isDarkTheme ? Color.darkThm.txt : Color.lightThm.txt, 0.9)}
         >
            Total Income
         </TextColourizer>
         <TextColourizer padding="0em 0em 0em 0.2em">
            <CurrencyOnCardTxt
               isDarkTheme={isDarkTheme}
               color={Color.setRgbOpacity(
                  isDarkTheme ? Color.darkThm.success : Color.lightThm.success,
                  0.7,
               )}
            >
               {NumberHelper.asCurrencyStr(latestTotalIncome, true)}
            </CurrencyOnCardTxt>
         </TextColourizer>
      </FlexColumnWrapper>
   );
}
