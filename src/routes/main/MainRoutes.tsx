import { Navigate, Route } from 'react-router-dom';
import RouteRedirector from '../../global/components/lib/renderModifiers/routeRedirector/RouteRedirector';
import useAuthContext from '../../global/context/auth/hooks/useAuthContext';
import NotFound from '../../pages/error/NotFound';
import MainLayout from '../../pages/main/MainLayout';
import Bank from '../../pages/main/bank/Bank';
import Expense from '../../pages/main/expense/Expense';
import Income from '../../pages/main/income/Income';
import Profile from '../../pages/main/profile/Profile';
import Settings from '../../pages/main/settings/Settings';

export default function MainRoutes(): JSX.Element {
   const { isSignedIn } = useAuthContext();
   const routeAuthProtection = <RouteRedirector redirectIf={!isSignedIn} redirectTo="auth" />;
   return (
      <>
         <Route element={routeAuthProtection}>
            <Route path="*" element={<NotFound />} />
            <Route path="/main" element={<MainLayout />}>
               <Route index element={<Navigate to="profile" />} />
               <Route path="profile" element={<Profile />} />
               <Route path="bank" element={<Bank />} />
               <Route path="income" element={<Income />} />
               <Route path="expense" element={<Expense />} />
               <Route path="settings" element={<Settings />} />
            </Route>
         </Route>
      </>
   );
}
