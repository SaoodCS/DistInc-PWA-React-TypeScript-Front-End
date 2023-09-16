import { useContext } from 'react';
import { ToastContext } from '../../../context/widget/toast/ToastContext';

export default function ToastExample(): JSX.Element {
   const { setShowToast, setToastMessage } = useContext(ToastContext);
   function handleShowToast(): void {
      setShowToast(true);
      setToastMessage('This is a test toast message');
   }

   return <button onClick={() => handleShowToast()}>Show Toast Example</button>;
}
