import { Route } from 'react-router-dom';
import RouteRedirector from '../../global/components/app/routeRedirector/RouteRedirector';
import useAuthContext from '../../global/hooks/useAuthContext';

export default function AuthRoute(): JSX.Element {
   const { isSignedIn } = useAuthContext();
   const routeRedirectIfLoggedIn = <RouteRedirector redirectIf={!!isSignedIn} redirectTo="/main" />;
   return (
      <Route element={routeRedirectIfLoggedIn}>
         <Route path="/auth" key={'auth'} element={<div>Authentication Here</div>} />
      </Route>
   );
}
