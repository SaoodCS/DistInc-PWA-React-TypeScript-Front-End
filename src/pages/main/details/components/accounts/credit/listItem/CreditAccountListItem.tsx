import { useContext } from 'react';
import {
   FirstRowWrapper,
   FlatListItem,
   ItemDescription,
   ItemDescriptionWrapper,
   ItemTitle,
   ItemTitleWrapper,
   SecondRowTagsWrapper,
   Tag,
} from '../../../../../../../global/components/lib/flatList/Style';
import useThemeContext from '../../../../../../../global/context/theme/hooks/useThemeContext';
import { BottomPanelContext } from '../../../../../../../global/context/widget/bottomPanel/BottomPanelContext';
import { ModalContext } from '../../../../../../../global/context/widget/modal/ModalContext';
import Color from '../../../../../../../global/css/colors';
import type { ICreditFormInputs } from '../class/Class';
import CreditClass from '../class/Class';
import CreditForm from '../form/CreditForm';
import CurrentClass from '../../current/class/Class';

interface ICreditAccountListItem {
   item: ICreditFormInputs;
}

export default function CreditAccountListItem(props: ICreditAccountListItem): JSX.Element {
   const { item } = props;
   const { isDarkTheme, isPortableDevice } = useThemeContext();
   const { toggleBottomPanel, setBottomPanelContent, setBottomPanelHeading, setBottomPanelZIndex } =
      useContext(BottomPanelContext);

   const { toggleModal, setModalContent, setModalZIndex, setModalHeader } =
      useContext(ModalContext);

   const { data: currentAccData } = CurrentClass.useQuery.getCurrentAccounts();

   function handleClick(item: ICreditFormInputs): void {
      if (isPortableDevice) {
         toggleBottomPanel(true);
         setBottomPanelHeading(item.accountName);
         setBottomPanelContent(<CreditForm inputValues={item} />);
         setBottomPanelZIndex(100);
      } else {
         toggleModal(true);
         setModalHeader(item.accountName);
         setModalContent(<CreditForm inputValues={item} />);
         setModalZIndex(100);
      }
   }

   function tagColor(tag: string): string {
      const mapper: { [key: string]: string } = {
         account: isDarkTheme ? Color.darkThm.txt : Color.lightThm.txt,
         type: isDarkTheme ? Color.darkThm.accent : Color.lightThm.accent,
         payBalanceFrom: isDarkTheme ? Color.darkThm.success : Color.lightThm.success,
      };
      return Color.setRgbOpacity(mapper[tag], 0.4);
   }

   function payBalanceFromAccName(payBalanceFromId: number): string | undefined {
      const currentAccount = currentAccData?.[payBalanceFromId];
      if (!currentAccount) return;
      return currentAccount.accountName;
   }

   return (
      <>
         {CreditClass.isType.creditItem(item) && (
            <FlatListItem key={item.id} isDarkTheme={isDarkTheme} onClick={() => handleClick(item)}>
               <FirstRowWrapper>
                  <ItemTitleWrapper>
                     <ItemTitle>{item.accountName}</ItemTitle>
                  </ItemTitleWrapper>
               </FirstRowWrapper>
               <ItemDescriptionWrapper>
                  <ItemDescription>{item.notes}</ItemDescription>
               </ItemDescriptionWrapper>
               <SecondRowTagsWrapper>
                  <Tag bgColor={tagColor('account')}>Credit Account</Tag>
                  <Tag bgColor={tagColor('type')}>Credit</Tag>
                  <Tag bgColor={tagColor('payBalanceFrom')}>
                     {`${payBalanceFromAccName(item.payBalanceFrom)} → ${item.accountName}`}
                  </Tag>
               </SecondRowTagsWrapper>
            </FlatListItem>
         )}
      </>
   );
}
