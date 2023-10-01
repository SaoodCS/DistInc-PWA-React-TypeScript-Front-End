import React from 'react';
import { TextBtn } from '../../../../../../global/components/lib/button/textBtn/Style';
import useThemeContext from '../../../../../../global/context/theme/hooks/useThemeContext';
import Color from '../../../../../../global/theme/colors';

export default function DeleteAccount(): JSX.Element {
   const { isDarkTheme } = useThemeContext();

   function handleClick(): void {
      console.log('delete account');
   }

   function handleBtnStyle(): React.CSSProperties {
      return {
         color: isDarkTheme ? Color.darkThm.error : Color.darkThm.error,
         display: 'inline-block',
      };
   }

   return (
      <div style={{ padding: '1em' }}>
         <strong>Deleting your account will do the following:</strong>
         <ul>
            <li>Log you out on all devices</li>
            <li>Remove all your account information from our database</li>
         </ul>
         <div>
            <strong>Press delete if you still want to go through with this:</strong>
            <TextBtn
               onClick={handleClick}
               isDarkTheme={isDarkTheme}
               style={{ ...handleBtnStyle() }}
            >
               Delete
            </TextBtn>
         </div>
      </div>
   );
}
