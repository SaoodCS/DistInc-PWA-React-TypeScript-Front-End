import { useContext } from 'react';
import {
   FirstRowWrapper,
   FlatListItem,
   ItemTitle,
   ItemTitleWrapper,
   SecondRowTagsWrapper,
   Tag,
} from '../../../../../../../global/components/lib/flatList/Style';
import ConditionalRender from '../../../../../../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import useThemeContext from '../../../../../../../global/context/theme/hooks/useThemeContext';
import { BottomPanelContext } from '../../../../../../../global/context/widget/bottomPanel/BottomPanelContext';
import { ModalContext } from '../../../../../../../global/context/widget/modal/ModalContext';
import Color from '../../../../../../../global/css/colors';
import type { OptionalNumberInput } from '../../../../../../../global/helpers/react/form/FormHelper';
import SavingsClass from '../../savings/class/Class';
import type { ICurrentFormInputs } from '../class/Class';
import CurrentClass from '../class/Class';
import CurrentForm from '../form/CurrentForm';

interface ICurrentAccountListItem {
   item: ICurrentFormInputs;
}

export default function CurrentAccountListItem(props: ICurrentAccountListItem): JSX.Element {
   const { item } = props;
   const { isDarkTheme, isPortableDevice } = useThemeContext();
   const { toggleBottomPanel, setBottomPanelContent, setBottomPanelHeading, setBottomPanelZIndex } =
      useContext(BottomPanelContext);

   const { toggleModal, setModalContent, setModalZIndex, setModalHeader } =
      useContext(ModalContext);

   const { data: savingsData } = SavingsClass.useQuery.getSavingsAccounts();

   function handleClick(item: ICurrentFormInputs): void {
      if (isPortableDevice) {
         setBottomPanelHeading(item.accountName);
         setBottomPanelContent(<CurrentForm inputValues={item} />);
         setBottomPanelZIndex(100);
         toggleBottomPanel(true);
      } else {
         setModalHeader(item.accountName);
         setModalContent(<CurrentForm inputValues={item} />);
         setModalZIndex(100);
         toggleModal(true);
      }
   }

   function tagColor(tag: string): string {
      const mapper: { [key: string]: string } = {
         account: isDarkTheme ? Color.darkThm.txt : Color.lightThm.txt,
         type: isDarkTheme ? Color.darkThm.accent : Color.lightThm.accent,
         cushion: isDarkTheme ? Color.darkThm.error : Color.lightThm.error,
         transfer: isDarkTheme ? Color.darkThm.success : Color.lightThm.success,
      };
      return Color.setRgbOpacity(mapper[tag], 0.4);
   }

   function leftoversTag(transferLeftoversId: OptionalNumberInput): string | undefined {
      const savingsAccount = savingsData?.[transferLeftoversId];
      if (!savingsAccount) return;
      return savingsAccount.accountName;
   }

   return (
      <>
         {CurrentClass.isType.currentItem(item) && (
            <FlatListItem key={item.id} isDarkTheme={isDarkTheme} onClick={() => handleClick(item)}>
               <FirstRowWrapper>
                  <ItemTitleWrapper>
                     <ItemTitle>{item.accountName}</ItemTitle>
                  </ItemTitleWrapper>
               </FirstRowWrapper>
               <SecondRowTagsWrapper>
                  <Tag bgColor={tagColor('account')}>Current Account</Tag>
                  <Tag bgColor={tagColor('type')}>{item.accountType}</Tag>
                  <ConditionalRender condition={!!item.minCushion}>
                     <Tag bgColor={tagColor('cushion')}>{`Cushion: £${item.minCushion}`}</Tag>
                  </ConditionalRender>
                  <ConditionalRender condition={!!item.transferLeftoversTo}>
                     <Tag bgColor={tagColor('transfer')}>
                        {`Leftovers → ${leftoversTag(item.transferLeftoversTo)}`}
                     </Tag>
                  </ConditionalRender>
               </SecondRowTagsWrapper>
            </FlatListItem>
         )}
      </>
   );
}
