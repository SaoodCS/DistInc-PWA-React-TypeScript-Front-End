/* eslint-disable @typescript-eslint/no-floating-promises */
import { useQuery } from '@tanstack/react-query';
import { useContext, useState } from 'react';
import { ThemeContext } from '../../../context/theme/ThemeContext';
import { DummyData } from '../../../helpers/lib/dummyContent/dummyData';
import ConditionalRender from '../../lib/conditionalRender/ConditionalRender';
import FetchError from '../../lib/fetch/fetchError/FetchError';
import OfflineFetch from '../../lib/fetch/offlineFetch/offlineFetch';
import {
   PlaceholderCircle,
   PlaceholderLine,
   PlaceholderRect,
} from '../../lib/fetch/placeholders/Style';
import PullToRefresh from '../../lib/pullToRefresh/PullToRefresh';
import ScrollSaver from '../../lib/scrollSaver/ScrollSaver';

export default function ScrollSaverExample(): JSX.Element {
   const [unmountComponent, setUnmountComponent] = useState(false);

   function handleUnmountComponent(): void {
      setUnmountComponent(true);
   }

   function remountComponent(): void {
      setUnmountComponent(false);
   }

   return (
      <>
         <button onClick={handleUnmountComponent}>Unmount Component</button>
         <button onClick={remountComponent}>Remount Component</button>
         <ConditionalRender condition={!unmountComponent}>
            <ScrollSaverWithData />
         </ConditionalRender>
      </>
   );
}

// -------------------------------------------------------------------------------------- //

function ScrollSaverWithData(): JSX.Element {
   const { isDarkTheme } = useContext(ThemeContext);
   const { isLoading, error, data, isPaused, refetch } = useQuery(['repoData'], () =>
      fetch(DummyData.endpoints.GET.dynamicRes).then((res) => res.json()),
   );

   if (isLoading && !isPaused)
      return (
         <>
            <PlaceholderCircle isDarkTheme={isDarkTheme} size="50px" />
            <PlaceholderRect isDarkTheme={isDarkTheme} height="50px" width="50px" />
            <PlaceholderLine isDarkTheme={isDarkTheme} />
         </>
      );
   if (isPaused) return <OfflineFetch />;
   if (error) return <FetchError />;

   return (
      <>
         <PullToRefresh onRefresh={refetch} isDarkTheme={isDarkTheme}>
            <ScrollSaver childHeight="80dvh" path="home" identifier="scrollexample">
               <div style={{ height: '80dvh' }}>
                  <div>STRT {JSON.stringify(data)} END</div>
               </div>
            </ScrollSaver>
         </PullToRefresh>
      </>
   );
}

// const [data, setData] = useState<string[]>([]);
// useEffect(() => {
//    fetch(DummyData.endpoints.GET.large)
//       .then((res) => res.json())
//       .then((res) => setData(res));
// }, []);
