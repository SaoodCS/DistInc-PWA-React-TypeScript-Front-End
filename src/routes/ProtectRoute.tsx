import { Navigate, Outlet } from 'react-router-dom';

interface IProtectedRoute {
   accessCondition: boolean;
   redirectPath: string;
   children?: JSX.Element;
}

export default function ProtectRoute(props: IProtectedRoute): JSX.Element {
   const { accessCondition, redirectPath, children } = props;
   if (!accessCondition) {
      return <Navigate to={redirectPath} replace={true} />;
   }
   return children ? children : <Outlet />;
}
