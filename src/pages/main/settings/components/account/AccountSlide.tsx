import { useContext, useEffect } from 'react';
import Asterisks from '../../../../../global/components/lib/asterisks/Asterisks';
import { TextColourizer } from '../../../../../global/components/lib/font/textColorizer/TextColourizer';
import { HorizontalMenuDots } from '../../../../../global/components/lib/icons/menu/HorizontalMenuDots';
import {
   ItemContainer,
   ItemContentWrapper,
   MenuListWrapper,
} from '../../../../../global/components/lib/menuList/Style';
import ConditionalRender from '../../../../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import useThemeContext from '../../../../../global/context/theme/hooks/useThemeContext';
import { BottomPanelContext } from '../../../../../global/context/widget/bottomPanel/BottomPanelContext';
import { auth } from '../../../../../global/firebase/config/config';
import useScrollSaver from '../../../../../global/hooks/useScrollSaver';
import useSessionStorage from '../../../../../global/hooks/useSessionStorage';
import Color from '../../../../../global/theme/colors';
import NSettings from '../../namespace/NSettings';
import ChangeEmailForm from './changeEmailForm/ChangeEmailForm';
import ChangePwdForm from './changePwdForm/ChangePwdForm';
import AccountClass from './class/AccountClass';

export default function AccountSlide(): JSX.Element {
   const [settingsCarousel] = useSessionStorage(NSettings.key.currentSlide, 1);
   const { isDarkTheme } = useThemeContext();
   const { containerRef, handleOnScroll, scrollToTop, scrollSaverStyle } = useScrollSaver(
      NSettings.key.accountSlide,
   );
   const {
      setIsBottomPanelOpen,
      setBottomPanelContent,
      setBottomPanelHeading,
      setBottomPanelHeightDvh,
      setBottomPanelZIndex,
   } = useContext(BottomPanelContext);

   useEffect(() => {
      if (settingsCarousel === 1) {
         scrollToTop();
      }
   }, []);

   function handleClick(name: string): void {
      if (name === 'Email' || name === 'Password') {
         setBottomPanelHeading(`New ${name}`);
         setBottomPanelHeightDvh(80);
         setBottomPanelContent(name === 'Email' ? <ChangeEmailForm /> : <ChangePwdForm />);
         setBottomPanelZIndex(0);
         setIsBottomPanelOpen(true);
      }
   }

   function handleDetailsColor(): string {
      return isDarkTheme
         ? Color.setRgbOpacity(Color.darkThm.txt, 0.5)
         : Color.setRgbOpacity(Color.lightThm.txt, 0.5);
   }

   return (
      <>
         <MenuListWrapper
            isDarkTheme={isDarkTheme}
            style={scrollSaverStyle}
            ref={containerRef}
            onScroll={handleOnScroll}
         >
            {AccountClass.menuOptions.map((item, index) => (
               <ItemContainer
                  key={index}
                  isDarkTheme={isDarkTheme}
                  spaceRow={item.withMenuDots}
                  onClick={() => handleClick(item.name)}
                  dangerItem={item.dangerItem}
                  warningItem={item.warningItem}
               >
                  <ItemContentWrapper>
                     {item.name}
                     <ConditionalRender condition={!!item.detailsContent}>
                        <TextColourizer color={handleDetailsColor()} fontSize="0.75em">
                           {item.name === 'Password' && <Asterisks size={'0.4em'} />}
                           {item.name === 'Email' && auth.currentUser?.email}
                        </TextColourizer>
                     </ConditionalRender>
                  </ItemContentWrapper>
                  <ConditionalRender condition={!!item.withMenuDots}>
                     <HorizontalMenuDots />
                  </ConditionalRender>
               </ItemContainer>
            ))}
         </MenuListWrapper>
      </>
   );
}
