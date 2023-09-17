import { Navigate, Route } from 'react-router-dom';
import RouteRedirector from '../../global/components/app/routeRedirector/RouteRedirector';
import ErrorPage from '../../pages/error/ErrorPage';

export default function LandingRoute(): JSX.Element {
   const isUserSignedInTest = true;

   return (
      <Route
         path="/"
         key={'landing'}
         errorElement={<ErrorPage />}
         element={
            <RouteRedirector redirectIf={!isUserSignedInTest} redirectTo="/auth">
               <Navigate to="/main" replace={true} />
            </RouteRedirector>
         }
      />
   );
}
