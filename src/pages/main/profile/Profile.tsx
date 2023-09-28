import { useEffect } from 'react';
import useSetHeaderTitle from '../../../global/context/header/hooks/useSetHeaderTitle';
import StringHelper from '../../../global/helpers/dataTypes/string/StringHelper';

export default function Profile(): JSX.Element {
   useSetHeaderTitle('Profile');

   return <div>Profile Page</div>;
}
