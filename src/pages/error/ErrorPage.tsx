import { useContext } from 'react';
import { TextBtn } from '../../global/components/lib/button/textBtn/Style';
import { ThemeContext } from '../../global/context/theme/ThemeContext';
import { ErrorHeading, ErrorPageWrapper, ErrorSubheading, ErrorText } from './Style';

export default function ErrorPage(): JSX.Element {
   const { isDarkTheme, toggleTheme } = useContext(ThemeContext);
   return (
      <ErrorPageWrapper>
         <ErrorHeading>Oops!</ErrorHeading>
         <ErrorSubheading>Something went wrong</ErrorSubheading>
         <ErrorText>
            Not to worry, try the following link to return back to the home page.
         </ErrorText>
         <TextBtn
            onClick={() => (window.location.href = '/')}
            isDarkTheme={isDarkTheme}
            style={{ marginTop: '0.5em' }}
         >
            Go Home
         </TextBtn>
      </ErrorPageWrapper>
   );
}
