import { Navigate, Route } from 'react-router-dom';
import ErrorPage from '../../pages/error/ErrorPage';
import RouteRedirector from '../redirector/RouteRedirector';

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
