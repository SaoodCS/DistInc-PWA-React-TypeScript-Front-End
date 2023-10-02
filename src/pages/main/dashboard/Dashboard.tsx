import HeaderHooks from '../../../global/context/header/hooks/HeaderHooks';

export default function Dashboard(): JSX.Element {
   HeaderHooks.useOnMount.setHeaderTitle('Dashboard');

   return <div>Dashboard Page</div>;
}
