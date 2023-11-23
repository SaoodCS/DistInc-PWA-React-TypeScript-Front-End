import styled from 'styled-components';

export const DonutChartNoDataPlaceholder = styled.div`
   display: flex;
   width: 100%;
   height: 100%;
   justify-content: center;
   align-items: center;
   &::after {
      content: '';
      width: 8em;
      height: 8em;
      background-size: cover;
      background-position: center center;
      background-repeat: repeat;
      border-radius: 50%;
      border: 25px solid rgba(178, 178, 178, 0.1);
   }
`;
