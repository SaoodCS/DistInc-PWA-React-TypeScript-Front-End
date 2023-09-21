import { Route } from 'react-router-dom';
import RouteRedirector from '../../global/components/lib/renderModifiers/routeRedirector/RouteRedirector';
import useAuthContext from '../../global/hooks/useAuthContext';
import NotFound from '../../pages/error/NotFound';
import AccountsLayout from '../../pages/main/accounts/Accounts';
import MainLayout from '../../pages/main/MainLayout';
import Settings from '../../pages/main/settings/Settings';

export default function MainRoutes(): JSX.Element {
   const { isSignedIn } = useAuthContext();
   const routeAuthProtection = <RouteRedirector redirectIf={!isSignedIn} redirectTo="auth" />;
   return (
      <>
         <Route element={routeAuthProtection}>
            <Route path="*" element={<NotFound />} />
            <Route path="main" element={<MainLayout />}>
               <Route path="accounts" element={<AccountsLayout />} />
               <Route path="settings" element={<Settings />} />
            </Route>
         </Route>
      </>
   );
}
