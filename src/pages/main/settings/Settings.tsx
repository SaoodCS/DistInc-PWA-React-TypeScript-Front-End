import { useContext } from 'react';
import { ThemeContext } from '../../../global/context/theme/ThemeContext';

export default function Settings(): JSX.Element {
   const { isDarkTheme } = useContext(ThemeContext);
   return (
      <div style={{ color: !isDarkTheme ? 'white' : 'red' }}>
         Rendered when visiting '/main/accounts/settings'
      </div>
   );
}
