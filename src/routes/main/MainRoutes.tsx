import { Route } from 'react-router-dom';
import RouteRedirector from '../../global/components/app/routeRedirector/RouteRedirector';
import useAuthContext from '../../global/hooks/useAuthContext';
import AccountsLayout from '../../pages/main/accounts/Accounts';
import MainLayout from '../../pages/main/MainLayout';
import Settings from '../../pages/main/settings/Settings';

export default function MainRoutes(): JSX.Element {
   const { isSignedIn } = useAuthContext();
   const routeProtectionByAuth = (
      <RouteRedirector redirectIf={!isSignedIn} redirectTo="/auth" />
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
