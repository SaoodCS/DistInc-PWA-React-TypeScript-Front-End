import { useEffect } from "react";
import useHeaderContext from "../context/header/hook/useHeaderContext";

export default function Income(): JSX.Element {
   const { setHeaderTitle, setShowBackBtn, setHandleBackBtnClick } = useHeaderContext();

   useEffect(() => {
      setHeaderTitle('Income');
   }, []);
   return (
      <div>
         <div>Income</div>
      </div>
   );
}
