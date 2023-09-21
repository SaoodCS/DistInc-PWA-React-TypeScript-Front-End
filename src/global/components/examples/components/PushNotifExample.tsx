// NOTE: You might only be able to test this on iPhone when you install the deployed version of the web app to your homescreen (localnet may not work)

import NotifHelpers from '../../../helpers/pwa/notifHelpers';

export default function PushNotifExample(): JSX.Element {
   async function handleClick(): Promise<void> {
      await NotifHelpers.sendPush('Test Push Notif Header', 'Test Push Notif Body');
   }

   return (
      <>
         <button onClick={handleClick}>Send Push Notif</button>
      </>
   );
}
