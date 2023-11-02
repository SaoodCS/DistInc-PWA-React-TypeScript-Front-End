import { QuestionMark as QMark } from '@styled-icons/boxicons-regular/QuestionMark';
import { Add } from '@styled-icons/fluentui-system-filled/Add';
import { Calculator } from '@styled-icons/fluentui-system-filled/Calculator';
import { DocumentFlowchart } from '@styled-icons/fluentui-system-filled/DocumentFlowchart';
import { Savings } from '@styled-icons/fluentui-system-filled/Savings';
import { useContext, useEffect } from 'react';
import styled from 'styled-components';
import { HeaderRightElWrapper } from '../../../global/components/app/layout/header/Header';
import { TextBtn } from '../../../global/components/lib/button/textBtn/Style';
import { CarouselAndNavBarWrapper } from '../../../global/components/lib/carousel/NavBar';
import FetchError from '../../../global/components/lib/fetch/fetchError/FetchError';
import OfflineFetch from '../../../global/components/lib/fetch/offlineFetch/offlineFetch';
import { FlatListWrapper } from '../../../global/components/lib/flatList/Style';
import DetailsPlaceholder from '../../../global/components/lib/flatList/placeholder/Placeholder';
import { TextColourizer } from '../../../global/components/lib/font/textColorizer/TextColourizer';
import { HorizontalMenuDots } from '../../../global/components/lib/icons/menu/HorizontalMenuDots';
import Loader from '../../../global/components/lib/loader/Loader';
import PullToRefresh from '../../../global/components/lib/pullToRefresh/PullToRefresh';
import useThemeContext from '../../../global/context/theme/hooks/useThemeContext';
import HeaderHooks from '../../../global/context/widget/header/hooks/HeaderHooks';
import useHeaderContext from '../../../global/context/widget/header/hooks/useHeaderContext';
import { ModalContext } from '../../../global/context/widget/modal/ModalContext';
import MyCSS from '../../../global/css/MyCSS';
import Color from '../../../global/css/colors';
import ArrayOfObjects from '../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import JSXHelper from '../../../global/helpers/dataTypes/jsx/jsxHelper';
import IncomeClass from '../details/components/Income/class/Class';
import CurrentClass from '../details/components/accounts/current/class/Class';
import ExpensesClass from '../details/components/expense/class/ExpensesClass';
import HelpRequirements from './components/HelpRequirements';
import DistributeForm from './components/distributerForm/DistributerForm';
import DistributerClass from './components/distributerForm/class/DistributerClass';

const CardListTitle = styled.div`
   margin-bottom: 1em;
`;

const CardListWrapper = styled(FlatListWrapper)`
   padding: 1em;
   box-sizing: border-box;
`;

const ItemTitleAndSubTitleWrapper = styled.div`
   display: flex;
   flex-direction: column;
   justify-content: space-between;
   align-items: start;
`;

const ItemRightColWrapper = styled.div`
   display: flex;
   flex-direction: column;
   justify-content: space-between;
   align-items: end;
`;

const ItemTitleAndIconWrapper = styled.div`
   display: flex;
   justify-content: center;
   align-items: center;
`;

const CardListItem = styled.div`
   ${MyCSS.Clickables.removeDefaultEffects};
   display: flex;
   border: 1px solid ${Color.darkThm.border};
   height: 5em;
   box-sizing: border-box;
   padding: 1em;
   border-radius: 10px;
   font-size: 0.9em;
   flex-direction: row;
   justify-content: space-between;
   background-color: ${Color.setRgbOpacity(Color.darkThm.txt, 0.05)};
   margin-bottom: 1em;
`;

export default function Distribute(): JSX.Element {
   HeaderHooks.useOnMount.setHeaderTitle('Distribute');
   HeaderHooks.useOnUnMount.resetHeaderRightEl();
   const { setHeaderRightElement } = useHeaderContext();
   const { isDarkTheme, isPortableDevice } = useThemeContext();
   const { setIsModalOpen, setModalContent, setModalZIndex, setModalHeader } =
      useContext(ModalContext);
   const { data: currentAccounts } = CurrentClass.useQuery.getCurrentAccounts();
   const { data: income } = IncomeClass.useQuery.getIncomes();
   const { data: expenses } = ExpensesClass.useQuery.getExpenses();
   const {
      data: calcDistData,
      isLoading,
      isPaused,
      error,
   } = DistributerClass.useQuery.getCalcDist({
      onSuccess: () => {
         setIsModalOpen(false);
      },
   });

   useEffect(() => {
      const reqCheck = DistributerClass.checkCalcReq(
         currentAccounts || {},
         income || {},
         expenses || {},
      );
      const isAllReqValid = ArrayOfObjects.doAllObjectsHaveKeyValuePair(reqCheck, 'isValid', true);
      const iconHeight = isPortableDevice ? '1.5em' : '1em';
      setHeaderRightElement(
         <HeaderRightElWrapper>
            <TextBtn
               onClick={() => {
                  setModalHeader(isAllReqValid ? 'Distribute' : 'Requirements');
                  setModalContent(isAllReqValid ? <DistributeForm /> : <HelpRequirements />);
                  setModalZIndex(100);
                  setIsModalOpen(true);
               }}
               isDarkTheme={isDarkTheme}
            >
               {isAllReqValid ? <Add height={iconHeight} /> : <QMark height={iconHeight} />}
            </TextBtn>
         </HeaderRightElWrapper>,
      );
   }, [currentAccounts, income, expenses]);

   if (isLoading && !isPaused) {
      if (!isPortableDevice) return <Loader isDisplayed />;
      return <FlatListWrapper>{JSXHelper.repeatJSX(<DetailsPlaceholder />, 7)}</FlatListWrapper>;
   }
   if (isPaused) return <OfflineFetch />;
   if (error) return <FetchError />;

   async function handleOnRefresh() {
      console.log('onFresh');
   }

   return (
      <CarouselAndNavBarWrapper>
         <TextColourizer fontSize="2em" bold padding="0.5em">
            History
         </TextColourizer>
         <PullToRefresh isDarkTheme={isDarkTheme} onRefresh={() => handleOnRefresh()}>
            <>
               <CardListWrapper>
                  <CardListTitle>July 2021</CardListTitle>
                  <CardListItem>
                     <ItemTitleAndIconWrapper>
                        <DocumentFlowchart height={'2em'} style={{ paddingRight: '0.5em' }} />
                        <ItemTitleAndSubTitleWrapper>
                           <TextColourizer>Distribution Instructions</TextColourizer>
                        </ItemTitleAndSubTitleWrapper>
                     </ItemTitleAndIconWrapper>
                     <ItemRightColWrapper>
                        <HorizontalMenuDots />
                        <TextColourizer fontSize="0.8em">12 Jul 2021</TextColourizer>
                     </ItemRightColWrapper>
                  </CardListItem>

                  <CardListItem>
                     <ItemTitleAndIconWrapper>
                        <Calculator height={'2em'} style={{ paddingRight: '0.5em' }} />
                        <ItemTitleAndSubTitleWrapper>
                           <TextColourizer>Analytics</TextColourizer>
                        </ItemTitleAndSubTitleWrapper>
                     </ItemTitleAndIconWrapper>
                     <ItemRightColWrapper>
                        <HorizontalMenuDots />
                        <TextColourizer fontSize="0.8em">12 Jul 2021</TextColourizer>
                     </ItemRightColWrapper>
                  </CardListItem>

                  <CardListItem>
                     <ItemTitleAndIconWrapper style={{ position: 'relative' }}>
                        <Savings height={'2em'} style={{ paddingRight: '0.5em' }} />
                        <ItemTitleAndSubTitleWrapper>
                           <TextColourizer>Main Savings</TextColourizer>
                           <TextColourizer fontSize="0.8em">
                              Balance History: £10,00.00
                           </TextColourizer>
                        </ItemTitleAndSubTitleWrapper>
                     </ItemTitleAndIconWrapper>

                     <ItemRightColWrapper>
                        <HorizontalMenuDots />
                        <TextColourizer fontSize="0.8em">12 Jul 2021</TextColourizer>
                     </ItemRightColWrapper>
                  </CardListItem>
               </CardListWrapper>
               <CardListWrapper>
                  <CardListTitle>July 2021</CardListTitle>
                  <CardListItem>
                     <ItemTitleAndIconWrapper>
                        <DocumentFlowchart height={'2em'} style={{ paddingRight: '0.5em' }} />
                        <ItemTitleAndSubTitleWrapper>
                           <TextColourizer>Distribution Instructions</TextColourizer>
                        </ItemTitleAndSubTitleWrapper>
                     </ItemTitleAndIconWrapper>
                     <ItemRightColWrapper>
                        <HorizontalMenuDots />
                        <TextColourizer fontSize="0.8em">12 Jul 2021</TextColourizer>
                     </ItemRightColWrapper>
                  </CardListItem>
               </CardListWrapper>
            </>
         </PullToRefresh>
      </CarouselAndNavBarWrapper>
   );
}

// const { analytics, savingsAccHistory, distributer } = calcDistData || {};

// return (
//    <>
//       <div>
//          {distributer &&
//             distributer.map((distributerObj, index) => (
//                <div key={index}>
//                   <p>{distributerObj.msgs}</p>
//                   <p>{distributerObj.timestamp}</p>
//                </div>
//             ))}
//       </div>
//    </>
// );
