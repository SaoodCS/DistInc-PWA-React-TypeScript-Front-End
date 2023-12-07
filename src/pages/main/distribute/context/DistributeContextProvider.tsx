import type { ReactNode } from 'react';
import { useContext, useEffect } from 'react';
import useCarousel from '../../../../global/components/lib/carousel/hooks/useCarousel';
import { AddIcon } from '../../../../global/components/lib/icons/add/AddIcon';
import { QMarkIcon } from '../../../../global/components/lib/icons/qMark/QMark';
import useThemeContext from '../../../../global/context/theme/hooks/useThemeContext';
import { BottomPanelContext } from '../../../../global/context/widget/bottomPanel/BottomPanelContext';
import FooterHooks from '../../../../global/context/widget/footer/hooks/FooterHooks';
import useFooterContext from '../../../../global/context/widget/footer/hooks/useFooterContext';
import HeaderHooks from '../../../../global/context/widget/header/hooks/HeaderHooks';
import useHeaderContext from '../../../../global/context/widget/header/hooks/useHeaderContext';
import { ModalContext } from '../../../../global/context/widget/modal/ModalContext';
import ArrayOfObjects from '../../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import BoolHelper from '../../../../global/helpers/dataTypes/bool/BoolHelper';
import useSessionStorage from '../../../../global/hooks/useSessionStorage';
import IncomeClass from '../../details/components/Income/class/Class';
import CurrentClass from '../../details/components/accounts/current/class/Class';
import ExpensesClass from '../../details/components/expense/class/ExpensesClass';
import HelpRequirements from '../components/calcPreReqList/HelpRequirements';
import DistributeForm from '../components/form/DistributerForm';
import NDist from '../namespace/NDist';
import { DistributeContext } from './DistributeContext';

interface IDistributeContextProvider {
   children: ReactNode;
}

export default function DistributeContextProvider(props: IDistributeContextProvider): JSX.Element {
   const { children } = props;
   HeaderHooks.useOnUnMount.resetHeaderRightEl();
   HeaderHooks.useOnUnMount.hideAndResetBackBtn();
   FooterHooks.useOnUnMount.resetFooterItemSecondClick();
   const { containerRef, scrollToSlide, currentSlide, setCurrentSlide } = useCarousel(
      1,
      NDist.Carousel.key.currentSlideNo,
   );
   const [slide2Data, setSlide2Data] = useSessionStorage<NDist.Carousel.ISlide2DataOptions>(
      NDist.Carousel.key.slide2Data,
      null,
   );
   const [slideName, setSlideName] = useSessionStorage<NDist.Carousel.ISlideNameOptions>(
      NDist.Carousel.key.currentSlideName,
      ArrayOfObjects.getObjWithKeyValuePair(NDist.Carousel.slides, 'slideNo', 1).name,
   );
   const [distStepsCompleted, setDistStepsCompleted] = useSessionStorage<number>(
      NDist.Carousel.key.distStepsCompleted,
      0,
   );
   const { setHandleBackBtnClick, hideAndResetBackBtn, setHeaderTitle, setHeaderRightElement } =
      useHeaderContext();
   const { setHandleFooterItemSecondClick, resetFooterItemSecondClick } = useFooterContext();
   const { isPortableDevice, isDarkTheme } = useThemeContext();
   const { toggleModal, setModalContent, setModalZIndex, setModalHeader, isModalOpen } =
      useContext(ModalContext);
   const {
      setBottomPanelContent,
      setBottomPanelHeading,
      setBottomPanelZIndex,
      isBottomPanelOpen,
      toggleBottomPanel,
   } = useContext(BottomPanelContext);

   const { data: currentAccounts } = CurrentClass.useQuery.getCurrentAccounts();
   const { data: income } = IncomeClass.useQuery.getIncomes();
   const { data: expenses } = ExpensesClass.useQuery.getExpenses();
   NDist.API.useQuery.getCalcDist({
      onSuccess: (data) => {
         if (isModalOpen || isBottomPanelOpen) {
            toggleModal(false);
            toggleBottomPanel(false);
            const firstDistObj = data.distSteps[0];
            if (firstDistObj) handleItemClick(firstDistObj, 'distSteps');
            scrollToSlide(2);
         }
      },
   });

   const rightElClick = (areAllPreReqMet: boolean): void => {
      if (!isPortableDevice) {
         toggleModal(true);
         setModalHeader(areAllPreReqMet ? 'Distribute' : 'Requirements');
         setModalContent(areAllPreReqMet ? <DistributeForm /> : <HelpRequirements />);
         setModalZIndex(100);
      } else {
         toggleBottomPanel(true);
         setBottomPanelHeading(areAllPreReqMet ? 'Distribute' : 'Requirements');
         setBottomPanelContent(areAllPreReqMet ? <DistributeForm /> : <HelpRequirements />);
         setBottomPanelZIndex(100);
      }
   };

   function setSlide2Elements(): void {
      setHandleBackBtnClick(() => scrollToSlide(1));
      setHandleFooterItemSecondClick(() => scrollToSlide(1));
      setHeaderRightElement(null);
   }

   function setSlide1Elements(): void {
      hideAndResetBackBtn();
      resetFooterItemSecondClick();
      setSlide2Data(null);
      setDistStepsCompleted(0);
      const areAllPreReqMet = NDist.Calc.areAllPreReqMet(
         currentAccounts || {},
         income || {},
         expenses || {},
      );
      const darktheme = BoolHelper.boolToStr(isDarkTheme);

      if (areAllPreReqMet)
         setHeaderRightElement(
            <AddIcon darktheme={darktheme} onClick={() => rightElClick(areAllPreReqMet)} />,
         );
      else
         setHeaderRightElement(
            <QMarkIcon darktheme={darktheme} onClick={() => rightElClick(areAllPreReqMet)} />,
         );
   }

   useEffect(() => {
      const slideTitle = NDist.Carousel.getSlideTitle(slideName);
      setHeaderTitle(slideTitle);
      const isSlideNameHistory = slideName === 'history';
      const isCurrentSlide1 = currentSlide === 1;
      if (!isSlideNameHistory) {
         if (isCurrentSlide1) setCurrentSlide(2);
         setSlide2Elements();
      }
      if (isSlideNameHistory) {
         if (!isCurrentSlide1) setCurrentSlide(1);
         setSlide1Elements();
      }
   }, [slideName, currentAccounts, income, expenses, isPortableDevice]);

   function handleItemClick(
      item: NDist.IAnalytics | NDist.IDistSteps | NDist.ISavingsAccHist,
      itemType: NDist.Carousel.ISlide2NameOptions,
   ): void {
      setSlideName(itemType);
      scrollToSlide(2);
      setSlide2Data(item);
   }

   return (
      <DistributeContext.Provider
         value={{
            carouselContainerRef: containerRef,
            scrollToSlide,
            currentSlide,
            handleItemClick,
            slide2Data,
            setSlide2Data,
            slideName,
            setSlideName,
            distStepsCompleted,
            setDistStepsCompleted,
         }}
      >
         {children}
      </DistributeContext.Provider>
   );
}
