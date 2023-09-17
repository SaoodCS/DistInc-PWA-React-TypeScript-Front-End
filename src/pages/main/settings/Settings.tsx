import { useContext } from 'react';
import { ThemeContext } from '../../../global/context/theme/ThemeContext';
import useThemeContext from '../../../global/hooks/useThemeContext';

export default function Settings(): JSX.Element {
   const { isDarkTheme } = useThemeContext();
   return (
      <div style={{ color: !isDarkTheme ? 'white' : 'red' }}>
         Rendered when visiting '/main/accounts/settings'
      </div>
   );
}
