import { useContext } from 'react';
import { ModalContext } from '../../../context/widget/modal/ModalContext';

export default function ModalExample(): JSX.Element {
   const { setModalContent, setModalHeader, setIsModalOpen } = useContext(ModalContext);

   function handleOpenModal(): void {
      setModalContent(<div>Content</div>);
      setModalHeader('Header');
      setIsModalOpen(true);
   }

   return (
      <>
         <button onClick={() => handleOpenModal()}>Show Modal</button>
      </>
   );
}
