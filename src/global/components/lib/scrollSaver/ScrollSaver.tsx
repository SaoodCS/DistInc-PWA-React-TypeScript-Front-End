import type { ReactNode } from 'react';
import { useEffect, useLayoutEffect, useRef } from 'react';
import useSessionStorage from '../../../hooks/useSessionStorage';
import { ContentDiv, ParentDiv } from './Style';

interface IScrollSaver {
   children: ReactNode;
   childHeight: string;
   path: string;
   identifier: string;
}

export default function ScrollSaver(props: IScrollSaver): JSX.Element {
   const { children, childHeight, path, identifier } = props;
   const [parentDivScrollPosV, setParentDivScrollPosV] = useSessionStorage(
      `${path}.${identifier}.ScrollPosV`,
      0,
   );
   const [contentDivHeight, setContentDivHeight] = useSessionStorage<string>(
      `${path}.${identifier}.contentHeight`,
      'auto',
   );
   const parentDivRef = useRef<HTMLDivElement>(null);
   const contentDivRef = useRef<HTMLDivElement>(null);

   useLayoutEffect(() => {
      if (contentDivRef.current) {
         contentDivRef.current.style.height = contentDivHeight;
      }
      if (parentDivRef.current) {
         parentDivRef.current.style.height = childHeight;
         parentDivRef.current.scrollTop = parentDivScrollPosV;
      }
   }, [contentDivRef, parentDivRef, childHeight]);

   useEffect(() => {
      return () => {
         if (contentDivRef.current) {
            setContentDivHeight(`${contentDivRef.current.clientHeight}px`);
         }
      };
   }, [contentDivRef]);

   function handleScroll(): void {
      if (parentDivRef.current) {
         setParentDivScrollPosV(parentDivRef.current.scrollTop);
      }
   }

   return (
      <ParentDiv ref={parentDivRef} onScroll={handleScroll}>
         <ContentDiv ref={contentDivRef}>{children}</ContentDiv>
      </ParentDiv>
   );
}
