import { Navigate, Route } from 'react-router-dom';
import RouteRedirector from '../../global/components/app/routeRedirector/RouteRedirector';
import useAuthContext from '../../global/hooks/useAuthContext';
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
