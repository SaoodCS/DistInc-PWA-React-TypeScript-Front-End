import { ChartData, ChartOptions } from 'chart.js';
import { _DeepPartialObject } from 'chart.js/dist/types/utils';
import { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
   DonutChartAndKeysWrapper,
   DonutChartKeysWrapper,
   DonutChartTitle,
   DonutChartWrapper,
   KeyIndicator,
   KeyIndicatorAndTextWrapper,
} from '../../../../../global/components/lib/donutChart/Style';
import { TextColourizer } from '../../../../../global/components/lib/font/textColorizer/TextColourizer';
import useThemeContext from '../../../../../global/context/theme/hooks/useThemeContext';
import Color from '../../../../../global/css/colors';
import ArrayOfObjects from '../../../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import MiscHelper from '../../../../../global/helpers/dataTypes/miscHelper/MiscHelper';
import ObjectOfObjects from '../../../../../global/helpers/dataTypes/objectOfObjects/objectsOfObjects';
import SavingsClass from '../../../details/components/accounts/savings/class/Class';
import ExpensesClass from '../../../details/components/expense/class/ExpensesClass';

const options: _DeepPartialObject<ChartOptions<'doughnut'>> = {
   responsive: true,
   maintainAspectRatio: false,
   cutout: '70%',
   plugins: {
      legend: {
         display: false,
      },
   },
};

export default function ExpenseByCategory() {
   const { data: expenseData } = ExpensesClass.useQuery.getExpenses();
   const { data: savingsAccounts } = SavingsClass.useQuery.getSavingsAccounts();
   const [donutChartLabels, setDonutChartLabels] = useState<string[]>([]);
   const [donutChartData, setDonutChartData] = useState<number[]>([]);
   const { isDarkTheme } = useThemeContext();

   useEffect(() => {
      if (
         MiscHelper.isNotFalsyOrEmpty(expenseData) &&
         MiscHelper.isNotFalsyOrEmpty(savingsAccounts)
      ) {
         const expenseAsArr = ObjectOfObjects.convertToArrayOfObj(expenseData);
         const categories = ArrayOfObjects.getArrOfValuesFromKey(expenseAsArr, 'expenseType');
         const savingsAccAsArr = ObjectOfObjects.convertToArrayOfObj(savingsAccounts);
         for (let i = 0; i < categories.length; i++) {
            if (categories[i].includes('Savings')) {
               const id = Number(categories[i].split(':')[1]);
               const savingsAccName = ArrayOfObjects.getObjWithKeyValuePair(
                  savingsAccAsArr,
                  'id',
                  id,
               );
               categories[i] = `${savingsAccName.accountName}`;
            }
         }
         setDonutChartLabels(categories);
         const expenseValues = ArrayOfObjects.getArrOfValuesFromKey(expenseAsArr, 'expenseValue');
         setDonutChartData(expenseValues);
      }
   }, [expenseData, savingsAccounts]);

   const backgroundColors = [
      Color.setRgbOpacity(isDarkTheme ? Color.darkThm.accent : Color.lightThm.accent, 0.6),
      Color.setRgbOpacity(isDarkTheme ? Color.darkThm.success : Color.lightThm.success, 0.6),
      Color.setRgbOpacity(isDarkTheme ? Color.darkThm.warning : Color.lightThm.warning, 0.6),
      Color.setRgbOpacity(isDarkTheme ? Color.darkThm.error : Color.lightThm.error, 0.6),
      Color.setRgbOpacity(isDarkTheme ? Color.darkThm.inactive : Color.lightThm.inactive, 0.6),
   ];

   const borderColors = [
      Color.setRgbOpacity(isDarkTheme ? Color.darkThm.accent : Color.lightThm.accent, 0.9),
      Color.setRgbOpacity(isDarkTheme ? Color.darkThm.success : Color.lightThm.success, 0.9),
      Color.setRgbOpacity(isDarkTheme ? Color.darkThm.warning : Color.lightThm.warning, 0.9),
      Color.setRgbOpacity(isDarkTheme ? Color.darkThm.error : Color.lightThm.error, 0.9),
      Color.setRgbOpacity(isDarkTheme ? Color.darkThm.inactive : Color.lightThm.inactive, 0.9),
   ];

   const data: ChartData<'doughnut', number[], string> = {
      labels: donutChartLabels,
      datasets: [
         {
            label: 'Amount',
            data: donutChartData,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1.5,
         },
      ],
   };

   return (
      <DonutChartAndKeysWrapper>
         <DonutChartWrapper>
            <Doughnut data={data} options={options} />
         </DonutChartWrapper>
         <DonutChartKeysWrapper isDarkTheme>
            <DonutChartTitle>Expense by category</DonutChartTitle>
            {donutChartLabels.map((label, index) => (
               <KeyIndicatorAndTextWrapper key={label}>
                  <KeyIndicator color={backgroundColors[index]} />
                  <TextColourizer fontSize="0.9em">{label}</TextColourizer>
               </KeyIndicatorAndTextWrapper>
            ))}
         </DonutChartKeysWrapper>
      </DonutChartAndKeysWrapper>
   );
}
