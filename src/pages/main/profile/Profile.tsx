import HeaderHooks from '../../../global/context/header/hooks/HeaderHooks';

export default function Profile(): JSX.Element {
   HeaderHooks.useOnMount.setHeaderTitle('Profile');

   return <div>Profile Page</div>;
}
