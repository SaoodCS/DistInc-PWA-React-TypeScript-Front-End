import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import BottomPanel from '../../../components/lib/bottomPanel/BottomPanel';
import { BottomPanelContext } from './BottomPanelContext';

interface IBottomPanelContextProvider {
   children: ReactNode;
}

export default function BottomPanelContextProvider(
   props: IBottomPanelContextProvider,
): JSX.Element {
   const { children } = props;
   const [isBottomPanelOpen, setIsBottomPanelOpen] = useState(false);
   const [bottomPanelContent, setBottomPanelContent] = useState(<></>);
   const [bottomPanelHeading, setBottomPanelHeading] = useState<string | undefined>(undefined);
   const [bottomPanelHeightDvh, setBottomPanelHeightDvh] = useState<number | undefined>(undefined);
   const [bottomPanelZIndex, setBottomPanelZIndex] = useState<number | undefined>(undefined);

   function handleCloseBottomPanel(): void {
      setIsBottomPanelOpen(false);
      setBottomPanelContent(<></>);
      setBottomPanelHeading(undefined);
      setBottomPanelHeightDvh(undefined);
      setBottomPanelZIndex(undefined);
   }

   const contextMemo = useMemo(
      () => ({
         setIsBottomPanelOpen,
         setBottomPanelContent,
         bottomPanelContent,
         setBottomPanelHeading,
         setBottomPanelHeightDvh,
         handleCloseBottomPanel,
         bottomPanelZIndex,
         setBottomPanelZIndex,
         isBottomPanelOpen,
      }),
      [
         setIsBottomPanelOpen,
         setBottomPanelContent,
         bottomPanelContent,
         setBottomPanelHeading,
         setBottomPanelHeightDvh,
         handleCloseBottomPanel,
         bottomPanelZIndex,
         setBottomPanelZIndex,
         isBottomPanelOpen,
      ],
   );

   return (
      <>
         <BottomPanelContext.Provider value={contextMemo}>{children}</BottomPanelContext.Provider>
         <BottomPanel
            isOpen={isBottomPanelOpen}
            onClose={() => handleCloseBottomPanel()}
            heading={bottomPanelHeading}
            height={bottomPanelHeightDvh}
            zIndex={bottomPanelZIndex}
         >
            {bottomPanelContent}
         </BottomPanel>
      </>
   );
}
