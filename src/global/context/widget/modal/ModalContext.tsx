import type { Dispatch, SetStateAction } from 'react';
import { createContext } from 'react';

interface IModalContext {
   setIsModalOpen: Dispatch<SetStateAction<boolean>>;
   setModalContent: Dispatch<SetStateAction<JSX.Element>>;
   setModalHeader: Dispatch<SetStateAction<string>>;
   modalContent: JSX.Element;
   modalZIndex: number | undefined;
   setModalZIndex: Dispatch<SetStateAction<number | undefined>>;
}

export const ModalContext = createContext<IModalContext>({
   setIsModalOpen: () => {},
   setModalContent: () => {},
   setModalHeader: () => {},
   modalContent: <></>,
   modalZIndex: undefined,
   setModalZIndex: () => {},
});
