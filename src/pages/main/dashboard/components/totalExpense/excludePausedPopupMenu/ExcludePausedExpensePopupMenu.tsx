import { Check } from '@styled-icons/boxicons-regular/Check';
import {
   PMItemContainer,
   PMItemTitle,
   PMItemsListWrapper,
} from '../../../../../../global/components/lib/popupMenu/Style';
import ConditionalRender from '../../../../../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import useThemeContext from '../../../../../../global/context/theme/hooks/useThemeContext';
import type BoolHelper from '../../../../../../global/helpers/dataTypes/bool/BoolHelper';
import useURLState from '../../../../../../global/hooks/useURLState';
import NTotalExpense from '../namespace/NTotalExpense';

export default function ExcludePausedExpensePopupMenu(): JSX.Element {
   const { isDarkTheme } = useThemeContext();
   const [isPausedExcluded, setIsPausedExcluded] = useURLState<BoolHelper.IAsString>({
      key: NTotalExpense.key.isPausedExcluded,
      defaultValue: 'false',
   });
   const [totalYearlyOrMonthly, setTotalYearlyOrMonthly] =
      useURLState<NTotalExpense.ITotalYearlyOrMonthly>({
         key: NTotalExpense.key.totalYearlyOrMonthly,
         defaultValue: 'All',
      });
   return (
      <PMItemsListWrapper isDarkTheme={isDarkTheme}>
         <PMItemContainer isDarkTheme={isDarkTheme} isHeadingItem>
            <PMItemTitle>Paused</PMItemTitle>
         </PMItemContainer>
         <PMItemContainer isDarkTheme={isDarkTheme} onClick={() => setIsPausedExcluded('true')}>
            <PMItemTitle>Exclude Paused</PMItemTitle>
            <ConditionalRender condition={isPausedExcluded === 'true'}>
               <Check />
            </ConditionalRender>
         </PMItemContainer>
         <PMItemContainer isDarkTheme={isDarkTheme} onClick={() => setIsPausedExcluded('false')}>
            <PMItemTitle>Include Paused</PMItemTitle>
            <ConditionalRender condition={isPausedExcluded !== 'true'}>
               <Check />
            </ConditionalRender>
         </PMItemContainer>

         <PMItemContainer isDarkTheme={isDarkTheme} isHeadingItem>
            <PMItemTitle>Frequency</PMItemTitle>
         </PMItemContainer>
         <PMItemContainer isDarkTheme={isDarkTheme} onClick={() => setTotalYearlyOrMonthly('All')}>
            <PMItemTitle>Yearly & Monthly</PMItemTitle>
            <ConditionalRender
               condition={totalYearlyOrMonthly !== 'Monthly' && totalYearlyOrMonthly !== 'Yearly'}
            >
               <Check />
            </ConditionalRender>
         </PMItemContainer>
         <PMItemContainer
            isDarkTheme={isDarkTheme}
            onClick={() => setTotalYearlyOrMonthly('Monthly')}
         >
            <PMItemTitle>Monthly Only</PMItemTitle>
            <ConditionalRender condition={totalYearlyOrMonthly === 'Monthly'}>
               <Check />
            </ConditionalRender>
         </PMItemContainer>
         <PMItemContainer
            isDarkTheme={isDarkTheme}
            onClick={() => setTotalYearlyOrMonthly('Yearly')}
         >
            <PMItemTitle>Yearly Only</PMItemTitle>
            <ConditionalRender condition={totalYearlyOrMonthly === 'Yearly'}>
               <Check />
            </ConditionalRender>
         </PMItemContainer>
      </PMItemsListWrapper>
   );
}
