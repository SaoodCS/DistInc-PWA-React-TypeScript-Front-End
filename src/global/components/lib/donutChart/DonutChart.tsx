import type { ChartData, ChartOptions } from 'chart.js';
import type { _DeepPartialObject } from 'chart.js/dist/types/utils';
import { Doughnut } from 'react-chartjs-2';
import useThemeContext from '../../../context/theme/hooks/useThemeContext';
import { TextColourizer } from '../font/textColorizer/TextColourizer';
import { FlexRowWrapper } from '../positionModifiers/flexRowWrapper/Style';
import ConditionalRender from '../renderModifiers/conditionalRender/ConditionalRender';
import {
   DonutChartAndKeysWrapper,
   DonutChartKeysWrapper,
   DonutChartWrapper,
   KeyIndicator,
   KeyIndicatorAndTextWrapper,
} from './Style';
import { DonutChartNoDataPlaceholder } from './placeholder/NoDataPlaceholder';

interface IDonutChart {
   options: _DeepPartialObject<ChartOptions<'doughnut'>>;
   data: ChartData<'doughnut', number[], string>;
   title: string;
   showPlaceholder: boolean;
   popupMenu?: JSX.Element;
}

export default function DonutChart(props: IDonutChart): JSX.Element {
   const { options, data, title, showPlaceholder, popupMenu } = props;
   const { isDarkTheme } = useThemeContext();
   const backgroundColors = data.datasets![0].backgroundColor! as string[];
   const labels = data.labels!;

   return (
      <>
         <ConditionalRender condition={showPlaceholder}>
            <FlexRowWrapper position="absolute" padding="1em">
               {title}
            </FlexRowWrapper>
         </ConditionalRender>
         <DonutChartAndKeysWrapper>
            <ConditionalRender condition={!showPlaceholder}>
               <DonutChartWrapper>
                  <Doughnut data={data} options={options} />
               </DonutChartWrapper>
               <DonutChartKeysWrapper isDarkTheme={isDarkTheme}>
                  <FlexRowWrapper
                     alignItems="center"
                     justifyContent="center"
                     padding="0em 0em 0.5em 0em"
                  >
                     {title}
                     {popupMenu}
                  </FlexRowWrapper>
                  {labels.map((label, index) => (
                     <KeyIndicatorAndTextWrapper key={label} noOfItems={labels.length}>
                        <KeyIndicator color={backgroundColors[index]} />
                        <TextColourizer>{label}</TextColourizer>
                     </KeyIndicatorAndTextWrapper>
                  ))}
               </DonutChartKeysWrapper>
            </ConditionalRender>
            <ConditionalRender condition={showPlaceholder}>
               <DonutChartNoDataPlaceholder />
               <FlexRowWrapper
                  height="100%"
                  width="100%"
                  position="absolute"
                  justifyContent="center"
                  alignItems="center"
                  style={{ textAlign: 'center' }}
               >
                  <TextColourizer color={'darkgrey'}>No Data For a Current Period</TextColourizer>
               </FlexRowWrapper>
            </ConditionalRender>
         </DonutChartAndKeysWrapper>
      </>
   );
}
