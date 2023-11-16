import { _DeepPartialObject } from 'chart.js/dist/types/utils';
import HeaderHooks from '../../../global/context/widget/header/hooks/HeaderHooks';
import SpendingsAnalytics from './spendingsAnalytics/SpendingsAnalytics';

export default function Dashboard(): JSX.Element {
   HeaderHooks.useOnMount.setHeaderTitle('Dashboard');

   return (
      <div style={{ padding: '1em' }}>
         <SpendingsAnalytics />
      </div>
   );
}
