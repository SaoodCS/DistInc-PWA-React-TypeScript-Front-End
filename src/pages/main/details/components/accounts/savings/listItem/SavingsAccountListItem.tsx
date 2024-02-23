import { useContext } from 'react';
import {
   FirstRowWrapper,
   FlatListItem,
   ItemTitle,
   ItemTitleWrapper,
   ItemValue,
   SecondRowTagsWrapper,
   Tag,
} from '../../../../../../../global/components/lib/flatList/Style';
import ConditionalRender from '../../../../../../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import useThemeContext from '../../../../../../../global/context/theme/hooks/useThemeContext';
import { BottomPanelContext } from '../../../../../../../global/context/widget/bottomPanel/BottomPanelContext';
import { ModalContext } from '../../../../../../../global/context/widget/modal/ModalContext';
import Color from '../../../../../../../global/css/colors';
import NumberHelper from '../../../../../../../global/helpers/dataTypes/number/NumberHelper';
import type { ISavingsFormInputs } from '../class/Class';
import SavingsClass from '../class/Class';
import SavingsForm from '../form/SavingsForm';

interface ISavingsAccountListItem {
   item: ISavingsFormInputs;
}

export default function SavingsAccountListItem(props: ISavingsAccountListItem): JSX.Element {
   const { item } = props;
   const { isDarkTheme, isPortableDevice } = useThemeContext();
   const { toggleBottomPanel, setBottomPanelContent, setBottomPanelHeading, setBottomPanelZIndex } =
      useContext(BottomPanelContext);

   const { toggleModal, setModalContent, setModalZIndex, setModalHeader } =
      useContext(ModalContext);

   function handleClick(item: ISavingsFormInputs): void {
      if (isPortableDevice) {
         toggleBottomPanel(true);
         setBottomPanelHeading(item.accountName);
         setBottomPanelContent(<SavingsForm inputValues={item} />);
         setBottomPanelZIndex(100);
      } else {
         toggleModal(true);
         setModalHeader(item.accountName);
         setModalContent(<SavingsForm inputValues={item} />);
         setModalZIndex(100);
      }
   }

   function tagColor(tag: string): string {
      const mapper: { [key: string]: string } = {
         account: isDarkTheme ? Color.darkThm.txt : Color.lightThm.txt,
         type: isDarkTheme ? Color.darkThm.accent : Color.lightThm.accent,
         target: isDarkTheme ? Color.darkThm.error : Color.lightThm.error,
         tracked: isDarkTheme ? Color.darkThm.success : Color.lightThm.success,
         amount: isDarkTheme ? Color.darkThm.warning : Color.lightThm.warning,
         coversYearlyExpenses: isDarkTheme ? Color.darkThm.inactive : Color.lightThm.inactive,
      };
      return Color.setRgbOpacity(mapper[tag], 0.4);
   }

   return (
      <>
         {SavingsClass.isType.savingsItem(item) && (
            <FlatListItem key={item.id} isDarkTheme={isDarkTheme} onClick={() => handleClick(item)}>
               <FirstRowWrapper>
                  <ItemTitleWrapper>
                     <ItemTitle>{item.accountName}</ItemTitle>
                  </ItemTitleWrapper>
                  <ConditionalRender condition={isPortableDevice}>
                     <ItemValue>
                        {!!item.currentBalance &&
                           NumberHelper.asCurrencyStr(item.currentBalance as number)}
                     </ItemValue>
                  </ConditionalRender>
               </FirstRowWrapper>
               <SecondRowTagsWrapper>
                  <Tag bgColor={tagColor('account')}>Savings Account</Tag>
                  <ConditionalRender condition={!isPortableDevice && !!item.currentBalance}>
                     <Tag bgColor={tagColor('amount')}>
                        Current Balance:{' '}
                        {!!item.currentBalance &&
                           NumberHelper.asCurrencyStr(item.currentBalance as number)}
                     </Tag>
                  </ConditionalRender>
                  <Tag bgColor={tagColor('type')}>Savings</Tag>
                  <ConditionalRender condition={!!item.targetToReach}>
                     <Tag bgColor={tagColor('target')}>{`Target: £${item.targetToReach}`}</Tag>
                  </ConditionalRender>
                  <ConditionalRender condition={item.isTracked === 'true'}>
                     <Tag bgColor={tagColor('tracked')}>Tracked</Tag>
                  </ConditionalRender>
                  <ConditionalRender condition={item.coversYearlyExpenses === 'true'}>
                     <Tag bgColor={tagColor('coversYearlyExpenses')}>Covers Yearly Expenses</Tag>
                  </ConditionalRender>
               </SecondRowTagsWrapper>
            </FlatListItem>
         )}
      </>
   );
}
