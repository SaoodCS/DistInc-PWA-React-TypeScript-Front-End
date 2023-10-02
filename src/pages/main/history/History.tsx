import HeaderHooks from '../../../global/context/header/hooks/HeaderHooks';

export default function History(): JSX.Element {
   HeaderHooks.useOnMount.setHeaderTitle('History');

   return (
      <div>
         <div>History Page</div>
      </div>
   );
}
