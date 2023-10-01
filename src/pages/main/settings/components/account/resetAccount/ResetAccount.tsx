import { TextBtn } from '../../../../../../global/components/lib/button/textBtn/Style';
import useThemeContext from '../../../../../../global/context/theme/hooks/useThemeContext';
import Color from '../../../../../../global/theme/colors';

export default function ResetAccount(): JSX.Element {
   const { isDarkTheme } = useThemeContext();

   function handleClick(): void {
      console.log('reset account');
   }

   function handleBtnStyle(): React.CSSProperties {
      return {
         color: isDarkTheme ? Color.darkThm.warning : Color.darkThm.warning,
         display: 'inline-block',
      };
   }

   return (
      <div style={{ padding: '1em' }}>
         <strong>Resetting your account will do the following:</strong>
         <ul>
            <li>Remove all your account information from our database</li>
            <li>Set up your account with a new blank storage</li>
         </ul>
         <strong>Press reset if you still want to go through with this:</strong>
         <TextBtn onClick={handleClick} isDarkTheme={isDarkTheme} style={{ ...handleBtnStyle() }}>
            Reset
         </TextBtn>
      </div>
   );
}
