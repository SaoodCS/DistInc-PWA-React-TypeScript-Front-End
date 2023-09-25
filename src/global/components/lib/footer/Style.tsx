import styled from 'styled-components';
import Color from '../../../theme/colors';

export const FooterContainer = styled.div`
   position: fixed;
   bottom: 0;
   height: 10%;
   width: 100dvw;
   display: flex;
   justify-content: space-between;
   align-items: start;
   border-top: 1px solid ${Color.darkThm.border};
   border-radius: 0.5em;
   & > * {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background-color: 'blue';
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
   }
   & > * {
      height: 50%;
      margin-top: 0.5em;
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      & > * {
         height: 100%;
         -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      }
   }
   & > *:first-child {
      padding-left: 0.5em;
   }
   & > *:last-child {
      padding-right: 0.5em;
   }
`;

export const FooterItem = styled.div<{ id: string }>`
   display: flex;
   flex-direction: column;
   align-items: center;
   user-select: none;
   &::after {
      content: '${(props) => props.id}';
      font-size: 0.8em;
      color: ${Color.setRgbOpacity(Color.darkThm.txt, 0.6)};
      text-transform: capitalize;
   }
`;