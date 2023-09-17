import { Route } from 'react-router-dom';
import ProtectRoute from '../RouteRedirector';

export default function AdminRoute(): JSX.Element {
   const isUserRoleAdmin = true;
   const routeProtectionByAdmin = <ProtectRoute condition={isUserRoleAdmin} redirectPath="/" />;
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
