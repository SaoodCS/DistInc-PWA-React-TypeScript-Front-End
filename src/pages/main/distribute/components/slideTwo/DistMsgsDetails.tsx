import { useEffect } from 'react';
import useLocalStorage from '../../../../../global/hooks/useLocalStorage';
import NDist from '../../namespace/NDist';


interface IDistMsgsDetails {
   distMsgsItem: NDist.IDistMsgs;
}

export default function DistMsgsDetails(props: IDistMsgsDetails): JSX.Element {
   const { distMsgsItem } = props;
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
