import { Check } from '@styled-icons/boxicons-regular/Check';
import {
   PMItemContainer,
   PMItemTitle,
   PMItemsListWrapper,
} from '../../../../../../global/components/lib/popupMenu/Style';
import ConditionalRender from '../../../../../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import useThemeContext from '../../../../../../global/context/theme/hooks/useThemeContext';
import BoolHelper from '../../../../../../global/helpers/dataTypes/bool/BoolHelper';
import useURLState from '../../../../../../global/hooks/useURLState';
import NTotalExpense from '../namespace/NTotalExpense';

export default function ExcludePausedExpensePopupMenu(): JSX.Element {
   const { isDarkTheme } = useThemeContext();
   const [isPausedExcluded, setIsPausedExcluded] = useURLState<BoolHelper.IAsString>({
      key: NTotalExpense.key.isPausedExcluded,
   });
   return (
      <PMItemsListWrapper isDarkTheme={isDarkTheme}>
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
      </PMItemsListWrapper>
   );
}
