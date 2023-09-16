import { Fragment, useEffect, useState } from 'react';
import useLocalStorage from '../../../hooks/useLocalStorage';
import Color from '../../../styles/colors';
import ConditionalRender from '../../lib/conditionalRender/ConditionalRender';
import Modal from '../../lib/modal/Modal';
import { TextColourizer } from '../../lib/textColorizer/TextColourizer';
import { TextIndenter } from '../../lib/textIndenter/TextIndenter';
import { VerticalSeperator } from '../../lib/verticalSeperator/VerticalSeperator';

export default function InstallAppModal(): JSX.Element {
   const [notInstalledOnUserDevice, setNotInstalledOnUserDevice] = useState(
      window.matchMedia('(display-mode: browser)').matches,
   );
   const [isIphone, setIsIphone] = useState(/iphone|ipod|ipad/i.test(window.navigator.userAgent));
   const [installationRequested, setInstallationRequested] = useLocalStorage(
      'installationRequested',
      false,
   );

   useEffect(() => {
      if (window.matchMedia('(display-mode: browser)').matches && !installationRequested) {
         setNotInstalledOnUserDevice(true);
      }
      if (/iphone|ipod|ipad/i.test(window.navigator.userAgent)) {
         setIsIphone(true);
      }
   }, []);

   const toggleClose = (): void => {
      setNotInstalledOnUserDevice(false);
      setInstallationRequested(true);
   };

   const iPhoneInstallSteps = [
      'Tap the share button',
      'Tap "Add to Home Screen"',
      'Tap "Add"',
      'Enjoy!',
   ];

   return (
      <>
         <Modal
            isOpen={notInstalledOnUserDevice && !installationRequested}
            onClose={() => toggleClose()}
            header="Installation"
         >
            <ConditionalRender condition={isIphone}>
               {'Install this app to your iPhone home screen for a better experience!'}
               <VerticalSeperator />

               {iPhoneInstallSteps.map((step, index) => (
                  <Fragment key={step}>
                     <TextColourizer color={Color.darkThm.accent}>
                        <TextIndenter /> {`${index + 1}. `}
                     </TextColourizer>
                     {step}
                     <VerticalSeperator />
                  </Fragment>
               ))}
            </ConditionalRender>
            <ConditionalRender condition={!isIphone}>
               {'Install this app to your Android / Desktop for a better experience!'}
               <VerticalSeperator />
            </ConditionalRender>
         </Modal>
      </>
   );
}
