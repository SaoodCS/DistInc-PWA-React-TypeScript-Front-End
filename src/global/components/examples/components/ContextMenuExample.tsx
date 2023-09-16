import { useContext } from 'react';
import { ThemeContext } from '../../../context/theme/ThemeContext';
import useContextMenu from '../../../hooks/useContextMenu';
import { StaticButton } from '../../lib/button/staticButton/Style';
import ContextMenu from '../../lib/contextMenu/ContextMenu';

export default function ContextMenuExample(): JSX.Element {
   const { showMenu, toggleMenu, buttonRef } = useContextMenu();
   const { isDarkTheme } = useContext(ThemeContext);

   return (
      <>
         <div
            style={{
               display: 'flex',
               width: '100%',
               justifyContent: 'end',
               position: 'fixed',
               bottom: 0,
            }}
         >
            <StaticButton
               onClick={() => toggleMenu()}
               isDarkTheme={isDarkTheme}
               ref={buttonRef}
               style={{ margin: '1em' }}
               isDisabled={showMenu}
            >
               Hello
            </StaticButton>
         </div>
         <ContextMenu
            ref={buttonRef}
            isOpen={showMenu}
            toggleClose={() => toggleMenu()}
            btnPosition={'bottom right'}
            widthPx={150}
         >
            <div>
               <p>Menu Item 1</p>
               <p>Menu Item 2</p>
               <p>Menu Item 3</p>
            </div>
         </ContextMenu>
      </>
   );
}
