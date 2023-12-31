import { Navigate, Route } from 'react-router-dom';
import RouteRedirector from '../../global/components/lib/renderModifiers/routeRedirector/RouteRedirector';
import useAuthContext from '../../global/context/auth/hooks/useAuthContext';
import NotFound from '../../pages/error/NotFound';
import MainLayout from '../../pages/main/MainLayout';
import Dashboard from '../../pages/main/dashboard/Dashboard';
import Details from '../../pages/main/details/Details';
import History from '../../pages/main/distribute/Distribute';
import Settings from '../../pages/main/settings/Settings';

export default function MainRoutes(): JSX.Element {
   const { isSignedIn } = useAuthContext();
   const routeAuthProtection = <RouteRedirector redirectIf={!isSignedIn} redirectTo="auth" />;
   return (
      <>
         <Route element={routeAuthProtection}>
            <Route path="*" element={<NotFound />} />
            <Route path="/main" element={<MainLayout />}>
               <Route index element={<Navigate to="dashboard" replace={true} />} />
               <Route path="dashboard" element={<Dashboard />} />
               <Route path="details" element={<Details />} />
               <Route path="distribute" element={<History />} />
               <Route path="settings" element={<Settings />} />
            </Route>
         </Route>
      </>
   );
}
