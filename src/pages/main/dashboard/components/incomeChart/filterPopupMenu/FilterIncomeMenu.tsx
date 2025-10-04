import {
   PMItemContainer,
   PMItemsListWrapper,
   PMItemTitle,
} from '../../../../../../global/components/lib/popupMenu/Style';
import ConditionalRender from '../../../../../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import useThemeContext from '../../../../../../global/context/theme/hooks/useThemeContext';
import StringHelper from '../../../../../../global/helpers/dataTypes/string/StringHelper';
import { Check } from '@styled-icons/boxicons-regular/Check';

import useURLState from '../../../../../../global/hooks/useURLState';
import N_IncomeChart from '../namespace/N_IncomeChart';

export default function FilterIncomeMenu(): JSX.Element {
   const { isDarkTheme } = useThemeContext();
   const [filterOutState, setFilterOutState] = useURLState({ key: N_IncomeChart.filtererKey });

   function changeFilterState(newFilterState: N_IncomeChart.ILineDetails['name']): void {
      if (filterOutState.includes(newFilterState)) {
         const removedItem = StringHelper.removeSequence(filterOutState, newFilterState);
         setFilterOutState(removedItem);
         return;
      }
      const addedItem = `${filterOutState}&${newFilterState}`;
      setFilterOutState(addedItem);
   }
   return (
      <PMItemsListWrapper isDarkTheme={isDarkTheme}>
         {N_IncomeChart.lineDetails.map((item) => (
            <PMItemContainer
               key={item.name}
               onClick={() => changeFilterState(item.name)}
               isDarkTheme={isDarkTheme}
            >
               <PMItemTitle>{item.title}</PMItemTitle>
               <ConditionalRender condition={!filterOutState.includes(item.name)}>
                  <Check />
               </ConditionalRender>
            </PMItemContainer>
         ))}
      </PMItemsListWrapper>
   );
}
