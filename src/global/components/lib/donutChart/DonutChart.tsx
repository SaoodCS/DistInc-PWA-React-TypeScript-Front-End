import { ChartData, ChartOptions } from 'chart.js';
import { _DeepPartialObject } from 'chart.js/dist/types/utils';
import { Doughnut } from 'react-chartjs-2';
import useThemeContext from '../../../context/theme/hooks/useThemeContext';
import { TextColourizer } from '../font/textColorizer/TextColourizer';
import {
   DonutChartAndKeysWrapper,
   DonutChartKeysWrapper,
   DonutChartTitle,
   DonutChartWrapper,
   KeyIndicator,
   KeyIndicatorAndTextWrapper,
} from './Style';

interface IDonutChart {
   options: _DeepPartialObject<ChartOptions<'doughnut'>>;
   data: ChartData<'doughnut', number[], string>;
   title: string;
}

export default function DonutChart(props: IDonutChart) {
   const { options, data, title } = props;
   const { isDarkTheme } = useThemeContext();
   const backgroundColors = data.datasets![0].backgroundColor! as string[];
   const labels = data.labels!;

   return (
      <DonutChartAndKeysWrapper>
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
      </DonutChartAndKeysWrapper>
   );
}
