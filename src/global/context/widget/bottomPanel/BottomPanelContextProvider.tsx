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

   function handleClose(): void {
      setBottomPanelContent(<></>);
      setBottomPanelHeading(undefined);
      setBottomPanelHeightDvh(undefined);
      setIsBottomPanelOpen(false);
   }

   const contextMemo = useMemo(
      () => ({
         setIsBottomPanelOpen,
         setBottomPanelContent,
         bottomPanelContent,
         setBottomPanelHeading,
         setBottomPanelHeightDvh,
      }),
      [setIsBottomPanelOpen, setBottomPanelContent, bottomPanelContent],
   );

   return (
      <>
         <BottomPanelContext.Provider value={contextMemo}>{children}</BottomPanelContext.Provider>
         <BottomPanel
            isOpen={isBottomPanelOpen}
            onClose={() => handleClose()}
            heading={bottomPanelHeading}
            height={bottomPanelHeightDvh}
         >
            {bottomPanelContent}
         </BottomPanel>
      </>
   );
}
