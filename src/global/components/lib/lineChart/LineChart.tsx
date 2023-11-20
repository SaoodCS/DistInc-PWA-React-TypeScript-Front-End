import type { ChartData, ChartOptions } from 'chart.js';
import type { _DeepPartialObject } from 'chart.js/dist/types/utils';
import type { ReactNode } from 'react';
import { Line } from 'react-chartjs-2';
import useThemeContext from '../../../context/theme/hooks/useThemeContext';
import BoolHelper from '../../../helpers/dataTypes/bool/BoolHelper';
import { TextColourizer } from '../font/textColorizer/TextColourizer';
import { FlexRowWrapper } from '../positionModifiers/flexRowWrapper/Style';
import ConditionalRender from '../renderModifiers/conditionalRender/ConditionalRender';
import { ChartInfo, ChartTitle, LineChartCardWrapper, LineChartPlaceholder } from './Style';

interface ILineChart {
   title: string;
   options: _DeepPartialObject<ChartOptions<'line'>>;
   data: () => ChartData<'line', number[], string>;
   infoComponent: ReactNode;
   titleElement?: ReactNode;
   showPlaceholder: boolean;
}

export default function LineChart(props: ILineChart): JSX.Element {
   const { title, options, data, infoComponent, titleElement, showPlaceholder } = props;
   const { isDarkTheme } = useThemeContext();
   return (
      <LineChartCardWrapper>
         <ChartTitle>
            <TextColourizer>{title}</TextColourizer>
            <ConditionalRender condition={!!titleElement && !showPlaceholder}>
               {titleElement}
            </ConditionalRender>
         </ChartTitle>
         <ConditionalRender condition={!showPlaceholder}>
            <ChartInfo> {infoComponent}</ChartInfo>
         </ConditionalRender>
         <Line options={options} data={data()} />
         <ConditionalRender condition={showPlaceholder}>
            <LineChartPlaceholder darktheme={BoolHelper.boolToStr(isDarkTheme)} />
            <FlexRowWrapper
               height="100%"
               width="100%"
               position="absolute"
               justifyContent="center"
               alignItems="center"
            >
               <TextColourizer color={'darkgrey'}>No Data For Current Period</TextColourizer>
            </FlexRowWrapper>
         </ConditionalRender>
      </LineChartCardWrapper>
   );
}
