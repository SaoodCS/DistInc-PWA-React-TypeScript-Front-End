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
   const [modalZIndex, setModalZIndex] = useState<number | undefined>(undefined);

   function handleClose(): void {
      setModalContent(<></>);
      setModalHeader(``);
      setIsModalOpen(false);
      setModalZIndex(undefined);
   }

   const contextMemo = useMemo(
      () => ({
         setIsModalOpen,
         setModalContent,
         setModalHeader,
         setModalZIndex,
         modalContent,
         modalZIndex,
      }),
      [setIsModalOpen, setModalContent, setModalHeader, modalContent, setModalZIndex, modalZIndex],
   );

   return (
      <>
         <ModalContext.Provider value={contextMemo}>{children}</ModalContext.Provider>
         <Modal isOpen={isModalOpen} onClose={() => handleClose()} header={modalHeader} zIndex = {modalZIndex}>
            {modalContent}
         </Modal>
      </>
   );
}
