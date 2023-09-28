import { useEffect } from "react";
import useHeaderContext from "../context/header/hook/useHeaderContext";
import useSetHeaderTitle from "../context/header/hook/useSetHeaderTitle";

export default function Income(): JSX.Element {
   useSetHeaderTitle('Income');
   
   return (
      <div>
         <div>Income</div>
      </div>
   );
}
