import useThemeContext from '../../../../context/theme/hooks/useThemeContext';
import { ErrorIcon, ErrorMsg, FetchErrorWrapper } from './Style';

export default function FetchError(): JSX.Element {
   const { isDarkTheme } = useThemeContext();

   return (
      <FetchErrorWrapper>
         <ErrorIcon size="100%" darktheme={isDarkTheme.toString()} />
         <ErrorMsg isDarkTheme={isDarkTheme}>An error occured whilst getting data.</ErrorMsg>
      </FetchErrorWrapper>
   );
}
