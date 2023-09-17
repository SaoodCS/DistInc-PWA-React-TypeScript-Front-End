import { Route } from 'react-router-dom';
import RouteRedirector from '../redirector/RouteRedirector';

export default function AuthRoute(): JSX.Element {
   const isUserSignedInTest = true;
   const routeRedirectIfLoggedIn = (
      <RouteRedirector redirectIf={isUserSignedInTest} redirectTo="/main" />
   );
   return (
      <Route element={routeRedirectIfLoggedIn}>
         <Route path="/auth" key={'auth'} element={<div>Authentication Here</div>} />
      </Route>
   );
}
