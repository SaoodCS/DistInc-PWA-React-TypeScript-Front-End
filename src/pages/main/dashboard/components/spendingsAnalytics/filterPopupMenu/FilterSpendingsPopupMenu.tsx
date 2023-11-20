import { Check } from '@styled-icons/boxicons-regular/Check';
import SpendingsChart from '../namespace/SpendingsChart';
import useThemeContext from '../../../../../../global/context/theme/hooks/useThemeContext';
import StringHelper from '../../../../../../global/helpers/dataTypes/string/StringHelper';
import {
   PMItemContainer,
   PMItemTitle,
   PMItemsListWrapper,
} from '../../../../../../global/components/lib/popupMenu/Style';
import useURLState from '../../../../../../global/hooks/useURLState';
import ConditionalRender from '../../../../../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';

export default function FilterSpendingsPopupMenu(): JSX.Element {
   const { isDarkTheme } = useThemeContext();
   const [filterOutState, setFilterOutState] = useURLState({ key: SpendingsChart.filtererKey });

   function changeFilterState(newFilterState: SpendingsChart.ILineDetails['name']): void {
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
         {SpendingsChart.lineDetails.map((item) => (
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
