import { Route, Routes } from 'react-router-dom';
import ErrorPage from '../../pages/errors/ErrorPage';
import NotFound from '../../pages/errors/NotFound';
import RouteRedirector from '../RouteRedirector';
import AccountsLayout from './accounts/Accounts';
import MainIndex from './index/MainIndex';
import MainLayout from './layout/MainLayout';
import Settings from './settings/Settings';

export default function MainRoutes(): JSX.Element {
   const isUserSignedInTest = true;
   const routeProtectionByAuth = (
      <RouteRedirector redirectIf={!isUserSignedInTest} redirectTo="/auth" />
   );
   return (
      <>
         <Route element={routeProtectionByAuth}>
            <Route path="/main/*">
               <Route path="*" element={<NotFound />} key={'notFound'} />
               <Route element={<MainLayout />} errorElement={<ErrorPage />}>
                  <Route index element={<MainIndex />} />
                  <Route path="accounts" element={<AccountsLayout />}>
                     <Route path="settings" element={<Settings />} />
                  </Route>
               </Route>
            </Route>
         </Route>
      </>
   );
}
