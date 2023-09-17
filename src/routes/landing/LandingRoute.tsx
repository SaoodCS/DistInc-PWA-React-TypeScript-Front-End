import { Navigate, Route } from 'react-router-dom';
import ErrorPage from '../../pages/errors/ErrorPage';
import RouteRedirector from '../RouteRedirector';

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
