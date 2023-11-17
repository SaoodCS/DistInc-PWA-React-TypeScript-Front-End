import { Check } from '@styled-icons/boxicons-regular/Check';
import {
   PMItemContainer,
   PMItemTitle,
   PMItemsListWrapper,
} from '../../../../global/components/lib/popupMenu/Style';
import ConditionalRender from '../../../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import useThemeContext from '../../../../global/context/theme/hooks/useThemeContext';
import StringHelper from '../../../../global/helpers/dataTypes/string/StringHelper';
import useURLState from '../../../../global/hooks/useURLState';
import SpendingsChart from './class';

export default function FilterSpendingsPopupMenu(): JSX.Element {
   const { isDarkTheme } = useThemeContext();
   const [filterOutState, setFilterOutState] = useURLState({ key: SpendingsChart.filtererKey });

   function changeFilterState(newFilterState: SpendingsChart.ILineDetails['name']) {
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
