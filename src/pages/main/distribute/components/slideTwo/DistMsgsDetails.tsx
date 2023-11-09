import { useEffect } from 'react';
import useLocalStorage from '../../../../../global/hooks/useLocalStorage';
import { ICalcSchema } from '../calculation/CalculateDist';

interface IDistMsgsDetails {
   distMsgsItem: ICalcSchema['distributer'][0];
}

export default function DistMsgsDetails(props: IDistMsgsDetails): JSX.Element {
   const { distMsgsItem } = props;
   const [prevDistMsgs, setPrevDistMsgs] = useLocalStorage('prevDistMsgs', distMsgsItem);

   useEffect(() => {
      if (distMsgsItem) {
         setPrevDistMsgs(distMsgsItem);
      }
   }, []);

   function distMsgsToRender(): ICalcSchema['distributer'][0] {
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
