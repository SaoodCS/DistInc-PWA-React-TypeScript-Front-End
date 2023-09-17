import { Route } from 'react-router-dom';
import AccountsLayout from '../../pages/main/accounts/Accounts';
import MainLayout from '../../pages/main/MainLayout';
import Settings from '../../pages/main/settings/Settings';
import RouteRedirector from '../redirector/RouteRedirector';

export default function MainRoutes(): JSX.Element {
   const isUserSignedInTest = true;
   const routeProtectionByAuth = (
      <RouteRedirector redirectIf={!isUserSignedInTest} redirectTo="/auth" />
   );
   return (
      <>
         <Route element={routeProtectionByAuth}>
            <Route path="/main/*">
               <Route element={<MainLayout />}>
                  <Route path="accounts" element={<AccountsLayout />} />
                  <Route path="settings" element={<Settings />} />
               </Route>
            </Route>
         </Route>
      </>
   );
}
