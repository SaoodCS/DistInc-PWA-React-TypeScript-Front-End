import HeaderHooks from '../../../global/context/header/hooks/HeaderHooks';

export default function Expense(): JSX.Element {
   HeaderHooks.useOnMount.setHeaderTitle('Expense');
   return (
      <div>
         <div>Expense</div>
      </div>
   );
}
