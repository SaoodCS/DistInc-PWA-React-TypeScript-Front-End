import { useContext, useEffect } from 'react';
import Asterisks from '../../../../../global/components/lib/asterisks/Asterisks';
import { HorizontalMenuDots } from '../../../../../global/components/lib/icons/menu/HorizontalMenuDots';
import {
   IconAndNameWrapper,
   ItemContainer,
   ItemContentWrapper,
   ItemDetails,
   MenuListWrapper,
   iconStyles,
} from '../../../../../global/components/lib/menuList/Style';
import ConditionalRender from '../../../../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import useThemeContext from '../../../../../global/context/theme/hooks/useThemeContext';
import { BottomPanelContext } from '../../../../../global/context/widget/bottomPanel/BottomPanelContext';
import { auth } from '../../../../../global/firebase/config/config';
import useScrollSaver from '../../../../../global/hooks/useScrollSaver';
import useSessionStorage from '../../../../../global/hooks/useSessionStorage';
import NSettings from '../../namespace/NSettings';
import ChangeEmailForm from './changeEmailForm/ChangeEmailForm';
import ChangePwdForm from './changePwdForm/ChangePwdForm';
import AccountClass from './class/AccountClass';

export default function AccountSlide(): JSX.Element {
   const [settingsCarousel] = useSessionStorage(NSettings.key.currentSlide, 1);
   const { isDarkTheme, isPortableDevice } = useThemeContext();
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
                     <IconAndNameWrapper row={isPortableDevice}>
                        <item.icon style={iconStyles(isPortableDevice)} />
                        {item.name}
                     </IconAndNameWrapper>
                     <ConditionalRender condition={!!item.detailsContent}>
                        <ItemDetails isDarkTheme={isDarkTheme}>
                           {item.name === 'Password' && <Asterisks size={'0.4em'} amount={15} />}
                           {item.name === 'Email' && auth.currentUser?.email}
                        </ItemDetails>
                     </ConditionalRender>
                  </ItemContentWrapper>
                  <ConditionalRender condition={!!item.withMenuDots && isPortableDevice}>
                     <HorizontalMenuDots />
                  </ConditionalRender>
               </ItemContainer>
            ))}
         </MenuListWrapper>
      </>
   );
}
