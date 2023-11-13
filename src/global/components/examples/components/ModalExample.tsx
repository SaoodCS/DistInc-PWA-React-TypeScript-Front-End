import { useContext } from 'react';
import { ModalContext } from '../../../context/widget/modal/ModalContext';

export default function ModalExample(): JSX.Element {
   const { setModalContent, setModalHeader, toggleModal } = useContext(ModalContext);

   function handleOpenModal(): void {
      setModalContent(<div>Content</div>);
      setModalHeader('Header');
      toggleModal(true);
   }

   return (
      <>
         <button onClick={() => handleOpenModal()}>Show Modal</button>
      </>
   );
}
