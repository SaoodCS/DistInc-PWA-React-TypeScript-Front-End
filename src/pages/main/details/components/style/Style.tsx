import styled from 'styled-components';

export const FlatListWrapper = styled.div`
   width: 100%;
`;

export const ItemTitle = styled.div`
   padding-right: 0.25em;
`;

export const SecondRowTagsWrapper = styled.div`
   display: flex;
`;

export const ItemValue = styled.div``;

export const ItemTitleWrapper = styled.div`
   font-weight: 600;
   display: flex;
`;

export const Tag = styled.div<{ bgColor: string }>`
   font-size: 0.7em;
   border-radius: 1em;
   text-align: center;
   width: fit-content;
   padding-right: 0.5em;
   padding-left: 0.5em;
   padding-top: 0.25em;
   padding-bottom: 0.25em;
   margin-left: 0.25em;
   margin-right: 0.25em;
   background-color: ${({ bgColor }) => bgColor};
`;

export const FlatListItem = styled.div<{ isDarkTheme: boolean }>`
   height: 6em;
   width: 100%;
   box-sizing: border-box;
   padding: 1em;
   display: flex;
   flex-direction: column;
   justify-content: center;
   border-bottom: 1px solid
      ${({ isDarkTheme }) => (isDarkTheme ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)')};
`;

export const FirstRowWrapper = styled.div`
   display: flex;
   justify-content: space-between;
   align-items: center;
   margin-bottom: 0.75em;
`;
