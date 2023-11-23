import { ChartData, ChartOptions } from 'chart.js';
import { _DeepPartialObject } from 'chart.js/dist/types/utils';
import { Doughnut } from 'react-chartjs-2';
import useThemeContext from '../../../context/theme/hooks/useThemeContext';
import { TextColourizer } from '../font/textColorizer/TextColourizer';
import { FlexRowWrapper } from '../positionModifiers/flexRowWrapper/Style';
import ConditionalRender from '../renderModifiers/conditionalRender/ConditionalRender';
import {
   DonutChartAndKeysWrapper,
   DonutChartKeysWrapper,
   DonutChartTitle,
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
}

export default function DonutChart(props: IDonutChart) {
   const { options, data, title, showPlaceholder } = props;
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
                  <DonutChartTitle>{title}</DonutChartTitle>
                  {labels.map((label, index) => (
                     <KeyIndicatorAndTextWrapper key={label}>
                        <KeyIndicator color={backgroundColors[index]} />
                        <TextColourizer fontSize="0.9em">{label}</TextColourizer>
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
