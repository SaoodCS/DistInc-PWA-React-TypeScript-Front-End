import HeaderHooks from '../../../global/context/header/hooks/HeaderHooks';

export default function Details(): JSX.Element {
   HeaderHooks.useOnMount.setHeaderTitle('Details');
   return (
      <>
         <div>Details Page</div>
      </>
   );
}
