import { Route } from 'react-router-dom';
import RouteRedirector from '../../global/components/lib/renderModifiers/routeRedirector/RouteRedirector';
import useAuthContext from '../../global/context/auth/hooks/useAuthContext';
import Authentication from '../../pages/auth/Authentication';
import NotFound from '../../pages/error/NotFound';

export default function AuthRoute(): JSX.Element {
   const { isSignedIn } = useAuthContext();
   const routeRedirectIfLoggedIn = <RouteRedirector redirectIf={!!isSignedIn} redirectTo="main" />;
   return (
      <Route element={routeRedirectIfLoggedIn}>
         <Route path="*" element={<NotFound />} />
         <Route path="auth" element={<Authentication />} />
      </Route>
   );
}
