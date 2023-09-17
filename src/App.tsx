import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useContext } from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { ThemeContext } from './global/context/theme/ThemeContext';
import { GlobalTheme } from './global/styles/theme';
import AdminRoute from './routes/admin/AdminRoute';
import AuthRoute from './routes/auth/AuthRoute';
import LandingRoute from './routes/landing/LandingRoute';
import MainRoutes from './routes/main/MainRoutes';
import NotFoundRoute from './routes/notFoundRoute/NotFoundRoute';

const queryClient = new QueryClient();

export default function App(): JSX.Element {
   const { isDarkTheme } = useContext(ThemeContext);

   return (
      <>
         <GlobalTheme darkTheme={isDarkTheme} />
         <QueryClientProvider client={queryClient}>
            <BrowserRouter>
            <Link to="/main">Main</Link>
               <Routes>
                  {LandingRoute()}
                  {NotFoundRoute()}
                  {AuthRoute()}
                  {MainRoutes()}
                  {AdminRoute()}
               </Routes>
            </BrowserRouter>
            <ReactQueryDevtools initialIsOpen={false} />
         </QueryClientProvider>
      </>
   );
}
