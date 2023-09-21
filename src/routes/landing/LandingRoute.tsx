import { Navigate, Route } from 'react-router-dom';
import RouteRedirector from '../../global/components/lib/renderModifiers/routeRedirector/RouteRedirector';
import useAuthContext from '../../global/context/auth/hooks/useAuthContext';
import ErrorPage from '../../pages/error/ErrorPage';

export default function LandingRoute(): JSX.Element {
   const { isSignedIn } = useAuthContext();
   return (
      <Route
         path="/"
         errorElement={<ErrorPage />}
         element={
            <RouteRedirector redirectIf={!isSignedIn} redirectTo="auth">
               <Navigate to="main" replace={true} />
            </RouteRedirector>
         }
      />
   );
}
