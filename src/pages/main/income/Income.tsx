import HeaderHooks from '../../../global/context/header/hooks/HeaderHooks';

export default function Income(): JSX.Element {
   HeaderHooks.useOnMount.setHeaderTitle('Income');

   return (
      <div>
         <div>Income</div>
      </div>
   );
}
