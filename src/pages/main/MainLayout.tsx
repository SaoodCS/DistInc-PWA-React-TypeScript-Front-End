import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Footer from '../../global/components/lib/footer/Footer';
import useThemeContext from '../../global/context/theme/hooks/useThemeContext';
import Color from '../../global/theme/colors';

const Body = styled.div`
   position: fixed;
   width: 100dvw;
   top: 10%;
   bottom: 10%;
   overflow: scroll;
`;

const Header = styled.div<{ isDarkTheme: boolean }>`
   position: fixed;
   top: 0;
   height: 10%;
   width: 100dvw;
   border-bottom: ${({ isDarkTheme }) =>
      isDarkTheme ? `1px solid ${Color.darkThm.border}` : `1px solid ${Color.lightThm.border}`};
   border-bottom-left-radius: 10px;
   border-bottom-right-radius: 10px;
`;

export default function MainLayout(): JSX.Element {
   const { isDarkTheme, toggleTheme } = useThemeContext();

   return (
      <>
         <Header isDarkTheme={isDarkTheme}>Hello</Header>
         <Body>
            <button onClick={toggleTheme}>Toggle Theme</button>
            <Outlet />
         </Body>
         <Footer />
      </>
   );
}
