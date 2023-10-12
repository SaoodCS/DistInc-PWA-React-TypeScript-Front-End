import HeaderHooks from '../../../global/context/widget/header/hooks/HeaderHooks';
import styled from 'styled-components';


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

