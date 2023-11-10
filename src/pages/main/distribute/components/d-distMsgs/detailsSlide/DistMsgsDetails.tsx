import { useContext, useEffect } from 'react';
import useLocalStorage from '../../../../../../global/hooks/useLocalStorage';
import type NDist from '../../../namespace/NDist';
import { DistributeContext } from '../../../context/DistributeContext';



export default function DistMsgsDetails(): JSX.Element {
   const { slide2Data } = useContext(DistributeContext);
   const distMsgsItem = slide2Data as NDist.IDistMsgs;
   const [prevDistMsgs, setPrevDistMsgs] = useLocalStorage('prevDistMsgs', distMsgsItem);

   useEffect(() => {
      if (distMsgsItem) {
         setPrevDistMsgs(distMsgsItem);
      }
   }, []);

   function distMsgsToRender(): NDist.IDistMsgs {
      if (!distMsgsItem) return prevDistMsgs;
      return distMsgsItem;
   }

   return (
      <div>
         {distMsgsToRender().timestamp}
         {distMsgsToRender().msgs[1]}
      </div>
   );
}
