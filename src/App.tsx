// TODO: update any other toggleContextWidg() functions to be togglethContextWidg(true) or togglethContextWidg(false) like i did with the bottom panel and modal context providers
import NotifSettings from './pages/main/settings/components/notifications/class/NotifSettings';
import AppRouter from './routes/AppRouter';

export default function App(): JSX.Element {
   NotifSettings.foregroundMessageHandler();
   return <AppRouter />;
}
