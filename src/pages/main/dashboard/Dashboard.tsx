import styled from 'styled-components';
import HeaderHooks from '../../../global/context/widget/header/hooks/HeaderHooks';

export default function Dashboard(): JSX.Element {
   HeaderHooks.useOnMount.setHeaderTitle('Dashboard');

   return (
      <div>
         <></>
         Dashboard Page
         <></>
      </div>
   );
}
