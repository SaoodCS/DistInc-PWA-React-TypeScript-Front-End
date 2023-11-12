import { useContext } from 'react';
import { FooterContext, IFooterContext } from '../FooterContext';

export default function useFooterContext(): IFooterContext {
   const {
      setHandleFooterItemSecondClick,
      handleFooterItemSecondClick,
      resetFooterItemSecondClick,
   } = useContext(FooterContext);
   return {
      handleFooterItemSecondClick,
      setHandleFooterItemSecondClick,
      resetFooterItemSecondClick,
   };
}
