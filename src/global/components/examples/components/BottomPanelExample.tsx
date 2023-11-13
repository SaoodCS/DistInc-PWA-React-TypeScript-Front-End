import { useContext } from 'react';
import { BottomPanelContext } from '../../../context/widget/bottomPanel/BottomPanelContext';

export default function BottomPanelExample(): JSX.Element {
   const {
      toggleBottomPanel,
      setBottomPanelContent,
      bottomPanelContent,
      setBottomPanelHeading,
      setBottomPanelHeightDvh,
   } = useContext(BottomPanelContext);

   function handleOpenBottomPanel(): void {
      setBottomPanelContent(<div>Content</div>);
      setBottomPanelHeading('Heading');
      setBottomPanelHeightDvh(50);
      toggleBottomPanel(true);
   }

   return (
      <>
         <button onClick={() => handleOpenBottomPanel()}>Show Bottom Panel</button>
      </>
   );
}
