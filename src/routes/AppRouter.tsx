import { BrowserRouter, Routes } from 'react-router-dom';
import WidgetContextProviders from '../global/context/widget/WidgetContextProviders';
import AdminRoute from './admin/AdminRoute';
import AuthRoute from './auth/AuthRoute';
import LandingRoute from './landing/LandingRoute';
import MainRoutes from './main/MainRoutes';
import NotFoundRoute from './notFound/NotFoundRoute';

export default function AppRouter(): JSX.Element {
   return (
      <BrowserRouter>
         <WidgetContextProviders>
            <Routes>
               {LandingRoute()}
               {NotFoundRoute()}
               {AuthRoute()}
               {AdminRoute()}
               {MainRoutes()}
            </Routes>
         </WidgetContextProviders>
      </BrowserRouter>
   );
}
