import useThemeContext from '../../../../hooks/useThemeContext';
import { ErrorIcon, ErrorMsg, FetchErrorWrapper } from './Style';

export default function FetchError(): JSX.Element {
   const { isDarkTheme } = useThemeContext();

   return (
      <FetchErrorWrapper>
         <ErrorIcon size="100%" darktheme={isDarkTheme} />
         <ErrorMsg isDarkTheme={isDarkTheme}>An error occured whilst getting data.</ErrorMsg>
      </FetchErrorWrapper>
   );
}
