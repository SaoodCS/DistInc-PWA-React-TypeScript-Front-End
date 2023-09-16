import type { ReactNode } from 'react';
import { useState } from 'react';
import Loader from '../../../components/lib/loader/Loader';
import { LoaderContext } from './LoaderContext';

interface ILoaderContextProvider {
   children: ReactNode;
}

export const LoaderContextProvider = (props: ILoaderContextProvider): JSX.Element => {
   const { children } = props;
   const [showLoader, setShowLoader] = useState(false);

   return (
      <>
         <LoaderContext.Provider value={{ showLoader, setShowLoader }}>
            {children}
         </LoaderContext.Provider>
         <Loader isDisplayed={showLoader} />
      </>
   );
};
