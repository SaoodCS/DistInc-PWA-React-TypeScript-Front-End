import { Check } from '@styled-icons/boxicons-regular/Check';
import {
   PMItemContainer,
   PMItemTitle,
   PMItemsListWrapper,
} from '../../../../../../global/components/lib/popupMenu/Style';
import ConditionalRender from '../../../../../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import useThemeContext from '../../../../../../global/context/theme/hooks/useThemeContext';
import useURLState from '../../../../../../global/hooks/useURLState';
import ExpenseChart from '../namespace/ExpenseChart';

export default function SelectExpenseByPopupMenu(): JSX.Element {
   const { isDarkTheme } = useThemeContext();
   const [expenseBy, setExpenseBy] = useURLState<ExpenseChart.Selector.IExpenseBy>({
      key: ExpenseChart.Selector.key,
   });

   return (
      <PMItemsListWrapper isDarkTheme={isDarkTheme}>
         <PMItemContainer isDarkTheme={isDarkTheme} onClick={() => setExpenseBy('expenseType')}>
            <PMItemTitle>Type</PMItemTitle>
            <ConditionalRender condition={expenseBy === 'expenseType'}>
               <Check />
            </ConditionalRender>
         </PMItemContainer>
         <PMItemContainer isDarkTheme={isDarkTheme} onClick={() => setExpenseBy('expenseName')}>
            <PMItemTitle>Name</PMItemTitle>
            <ConditionalRender condition={expenseBy === 'expenseName'}>
               <Check />
            </ConditionalRender>
         </PMItemContainer>
         <PMItemContainer isDarkTheme={isDarkTheme} onClick={() => setExpenseBy('unpaused')}>
            <PMItemTitle>Unpaused</PMItemTitle>
            <ConditionalRender condition={expenseBy === 'unpaused'}>
               <Check />
            </ConditionalRender>
         </PMItemContainer>
         <PMItemContainer isDarkTheme={isDarkTheme} onClick={() => setExpenseBy('Yearly')}>
            <PMItemTitle>Yearly</PMItemTitle>
            <ConditionalRender condition={expenseBy === 'Yearly'}>
               <Check />
            </ConditionalRender>
         </PMItemContainer>
         <PMItemContainer isDarkTheme={isDarkTheme} onClick={() => setExpenseBy('Monthly')}>
            <PMItemTitle>Monthly</PMItemTitle>
            <ConditionalRender condition={expenseBy === 'Monthly'}>
               <Check />
            </ConditionalRender>
         </PMItemContainer>
      </PMItemsListWrapper>
   );
}
