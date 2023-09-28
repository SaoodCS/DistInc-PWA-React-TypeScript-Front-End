import { useEffect } from 'react';
import StringHelper from '../../../global/helpers/dataTypes/string/StringHelper';
import useHeaderContext from '../context/header/hook/useHeaderContext';

export default function Profile(): JSX.Element {
   const { setHeaderTitle, setShowBackBtn, setHandleBackBtnClick } = useHeaderContext();

   useEffect(() => {
      setHeaderTitle('Profile');
   }, []);
   return <div>Profile Page</div>;
}
