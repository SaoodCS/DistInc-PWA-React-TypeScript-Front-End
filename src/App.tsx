// TODO: update any other toggleContextWidg() functions to be togglethContextWidg(true) or togglethContextWidg(false) like i did with the bottom panel and modal context providers
import Notif from './pages/main/settings/components/notifications/namespace/Notif';
import AppRouter from './routes/AppRouter';

export default function App(): JSX.Element {
   Notif.FcmHelper.onForegroundListener();
   return <AppRouter />;
}
