import { useContext } from 'react';
import { ThemeContext } from '../../../../context/theme/ThemeContext';
import { ErrorIcon, ErrorMsg, FetchErrorWrapper } from './Style';

export default function FetchError(): JSX.Element {
   const { isDarkTheme } = useContext(ThemeContext);

   return (
      <FetchErrorWrapper>
         <ErrorIcon size="100%" darktheme={isDarkTheme} />
         <ErrorMsg isDarkTheme={isDarkTheme}>An error occured whilst getting data.</ErrorMsg>
      </FetchErrorWrapper>
   );
}
