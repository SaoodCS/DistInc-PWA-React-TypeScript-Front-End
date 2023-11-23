import useThemeContext from '../../../context/theme/hooks/useThemeContext';
import { FlexCenterer } from '../positionModifiers/centerers/FlexCenterer';
import { FlexRowWrapper } from '../positionModifiers/flexRowWrapper/Style';
import ConditionalRender from '../renderModifiers/conditionalRender/ConditionalRender';
import { CustomSpinner } from './Style';

interface IRelativeLoader {
   isDisplayed: boolean;
   sizePx?: number;
}

export default function RelativeLoader(props: IRelativeLoader): JSX.Element {
   const { isDisplayed, sizePx } = props;
   const { isDarkTheme } = useThemeContext();

   return (
      <ConditionalRender condition={isDisplayed}>
         <FlexRowWrapper height="100%" width="100%" justifyContent="center" alignItems="center">
            <CustomSpinner isDarkTheme={isDarkTheme} sizePx={`${sizePx || 45}px`} />
         </FlexRowWrapper>
      </ConditionalRender>
   );
}
