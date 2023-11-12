import { useContext, useEffect } from 'react';
import { FooterContext, IFooterContext } from '../FooterContext';

export default class FooterHooks {
   static useFooterContext(): IFooterContext {
      const {
         handleFooterItemSecondClick,
         setHandleFooterItemSecondClick,
         resetFooterItemSecondClick,
      } = useContext(FooterContext);
      return {
         handleFooterItemSecondClick,
         setHandleFooterItemSecondClick,
         resetFooterItemSecondClick,
      };
   }

   static useOnUnMount = {
      resetFooterItemSecondClick: () => {
         const { resetFooterItemSecondClick } = FooterHooks.useFooterContext();
         useEffect(() => {
            return () => {
               resetFooterItemSecondClick();
            };
         }, []);
      },
   };
}
