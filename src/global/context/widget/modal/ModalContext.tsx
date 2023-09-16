import type { Dispatch, SetStateAction } from 'react';
import { createContext } from 'react';

interface IModalContext {
   setIsModalOpen: Dispatch<SetStateAction<boolean>>;
   setModalContent: Dispatch<SetStateAction<JSX.Element>>;
   setModalHeader: Dispatch<SetStateAction<string>>;
   modalContent: JSX.Element;
}

export const ModalContext = createContext<IModalContext>({
   setIsModalOpen: () => {},
   setModalContent: () => {},
   setModalHeader: () => {},
   modalContent: <></>,
});
