import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useContext } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeContext } from './global/context/theme/ThemeContext';
import { GlobalTheme } from './global/styles/theme';
import ErrorPage from './pages/errors/ErrorPage';
import NotFound from './pages/errors/NotFound';

const queryClient = new QueryClient();

export default function App(): JSX.Element {
   const { isDarkTheme, toggleTheme } = useContext(ThemeContext);

   return (
      <>
         <GlobalTheme darkTheme={isDarkTheme} />
         <QueryClientProvider client={queryClient}>
            <BrowserRouter>
               <Routes>
                  <Route path="*" element={<NotFound />} key={'notFound'} />
                  <Route
                     path="/"
                     element={<div>Landing</div>}
                     key={'landing'}
                     errorElement={<ErrorPage />}
                  ></Route>
               </Routes>
            </BrowserRouter>
            <ReactQueryDevtools initialIsOpen={false} />
         </QueryClientProvider>
      </>
   );
}
