import { Route } from 'react-router-dom';
import RouteRedirector from '../../global/components/app/routeRedirector/RouteRedirector';
import useAuthContext from '../../global/hooks/useAuthContext';
import NotFound from '../../pages/error/NotFound';

export default function AdminRoute(): JSX.Element {
   const { isSignedIn } = useAuthContext();
   const routeProtectionByAdmin = <RouteRedirector redirectIf={!isSignedIn} redirectTo="/" />;
   return (
      <Route element={routeProtectionByAdmin}>
         <Route path="*" element={<NotFound />} />
         <Route
            path="admin"
            element={
               <div>
                  Renders when user visits /admin only if user is signed in and has admin role.
                  Otherwise, redirects user to landing page
               </div>
            }
         />
      </Route>
   );
}
