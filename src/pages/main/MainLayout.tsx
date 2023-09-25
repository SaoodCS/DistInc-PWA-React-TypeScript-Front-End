import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Footer from '../../global/components/lib/footer/Footer';
import useThemeContext from '../../global/context/theme/hooks/useThemeContext';

const Body = styled.div`
   position: fixed;
   width: 100dvw;
   top: 10%;
   bottom: 10%;
`;

const Header = styled.div`
   position: fixed;
   top: 0;
   height: 10%;
   width: 100dvw;
`;

export default function MainLayout(): JSX.Element {
   const { isDarkTheme } = useThemeContext();

   return (
      <>
         <Header>Hello</Header>
         <Body>
            <Outlet />
         </Body>
         <Footer />
      </>
   );
}
