import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import Modal from '../../../components/lib/modal/Modal';
import { ModalContext } from './ModalContext';

interface IModalContextProvider {
   children: ReactNode;
}

export default function ModalContextProvider(props: IModalContextProvider): JSX.Element {
   const { children } = props;
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [modalContent, setModalContent] = useState(<></>);
   const [modalHeader, setModalHeader] = useState(``);

   function handleClose(): void {
      setModalContent(<></>);
      setModalHeader(``);
      setIsModalOpen(false);
   }

   const contextMemo = useMemo(
      () => ({
         setIsModalOpen,
         setModalContent,
         setModalHeader,
         modalContent,
      }),
      [setIsModalOpen, setModalContent, setModalHeader, modalContent],
   );

   return (
      <>
         <ModalContext.Provider value={contextMemo}>{children}</ModalContext.Provider>
         <Modal isOpen={isModalOpen} onClose={() => handleClose()} header={modalHeader}>
            {modalContent}
         </Modal>
      </>
   );
}
