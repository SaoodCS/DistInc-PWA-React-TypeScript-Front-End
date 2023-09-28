import { useEffect } from 'react';
import StringHelper from '../../../global/helpers/dataTypes/string/StringHelper';
import useHeaderContext from '../context/header/hook/useHeaderContext';
import useSetHeaderTitle from '../context/header/hook/useSetHeaderTitle';

export default function Profile(): JSX.Element {
   useSetHeaderTitle('Profile');

   return <div>Profile Page</div>;
}
