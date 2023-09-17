import { useContext } from 'react';
import { ThemeContext } from '../../../context/theme/ThemeContext';
import useThemeContext from '../../../hooks/useThemeContext';
import { CenterWrapper } from '../centerers/CenterWrapper';
import ConditionalRender from '../conditionalRender/ConditionalRender';
import { DimOverlay } from '../overlay/dimOverlay/DimOverlay';
import { CustomSpinner } from './Style';

interface ILoader {
   isDisplayed: boolean;
}

export default function Loader(props: ILoader): JSX.Element {
   const { isDisplayed } = props;
   const { isDarkTheme } = useThemeContext();

   return (
      <ConditionalRender condition={isDisplayed}>
         <DimOverlay isDisplayed={isDisplayed} />
         <CenterWrapper centerOfScreen>
            <CustomSpinner isDarkTheme={isDarkTheme} />
         </CenterWrapper>
      </ConditionalRender>
   );
}
