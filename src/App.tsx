import { useContext } from 'react';
import { ThemeContext } from './global/context/theme/ThemeContext';
import { GlobalTheme } from './global/styles/theme';

export default function App(): JSX.Element {
   const { isDarkTheme, toggleTheme } = useContext(ThemeContext);

   return (
      <>
         <GlobalTheme darkTheme={isDarkTheme} />
         Hello
      </>
   );
}
