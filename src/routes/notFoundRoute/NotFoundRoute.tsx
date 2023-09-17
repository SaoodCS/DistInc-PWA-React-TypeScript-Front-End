import { Route } from 'react-router-dom';
import NotFound from '../../pages/errors/NotFound';

export default function NotFoundRoute(): JSX.Element {
   return <Route path="*" element={<NotFound />} key={'notFound'} />;
}
