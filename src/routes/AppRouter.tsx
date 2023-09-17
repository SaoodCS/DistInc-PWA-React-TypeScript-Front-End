import { BrowserRouter, Routes } from 'react-router-dom';
import AdminRoute from './admin/AdminRoute';
import AuthRoute from './auth/AuthRoute';
import LandingRoute from './landing/LandingRoute';
import MainRoutes from './main/MainRoutes';
import NotFoundRoute from './notFoundRoute/NotFoundRoute';

export default function AppRouter(): JSX.Element {
   return (
      <BrowserRouter>
         <Routes>
            {LandingRoute()}
            {NotFoundRoute()}
            {AuthRoute()}
            {AdminRoute()}
            {MainRoutes()}
         </Routes>
      </BrowserRouter>
   );
}
