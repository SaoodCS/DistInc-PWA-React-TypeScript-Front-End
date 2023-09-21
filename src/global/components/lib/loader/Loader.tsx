import useThemeContext from '../../../hooks/useThemeContext';
import { DimOverlay } from '../overlay/dimOverlay/DimOverlay';
import { CenterWrapper } from '../positionModifiers/centerers/CenterWrapper';
import ConditionalRender from '../renderModifiers/conditionalRender/ConditionalRender';
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
