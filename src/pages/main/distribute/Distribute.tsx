import HeaderHooks from '../../../global/context/widget/header/hooks/HeaderHooks';

export default function Distribute(): JSX.Element {
   HeaderHooks.useOnMount.setHeaderTitle('Distribute');

   return (
      <div>
         <div>Distribute Page</div>
      </div>
   );
}
