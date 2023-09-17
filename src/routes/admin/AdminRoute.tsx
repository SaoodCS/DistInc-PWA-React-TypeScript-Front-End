import { Route } from 'react-router-dom';
import RouteRedirector from '../../global/components/app/routeRedirector/RouteRedirector';
import useAuthContext from '../../global/hooks/useAuthContext';

export default function AdminRoute(): JSX.Element {
   const { isSignedIn } = useAuthContext();
   const routeProtectionByAdmin = <RouteRedirector redirectIf={!isSignedIn} redirectTo="/main" />;
   return (
      <Route element={routeProtectionByAdmin}>
         <Route
            path="admin"
            key={'admin'}
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
