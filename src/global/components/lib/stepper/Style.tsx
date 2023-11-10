import { Stepper } from '@zendeskgarden/react-accordions';
import styled from 'styled-components';
import Color from '../../../css/colors';
import BoolHelper from '../../../helpers/dataTypes/bool/BoolHelper';

interface IStepperLabel {
   completed: BoolHelper.IAsString;
   darktheme: BoolHelper.IAsString;
   isnext: BoolHelper.IAsString;
}

export const StyledStepperLine = styled(Stepper.Content)``;

export const StyledStepper = styled(Stepper)`
   padding: 1.5em;
`;

export const StyledStepperLabel = styled(Stepper.Label)<IStepperLabel>`
   color: ${({ completed, darktheme, isnext }): string => {
      const isCompleted = BoolHelper.convert(completed);
      const isNext = BoolHelper.convert(isnext);
      const isDarkTheme = BoolHelper.convert(darktheme);
      if (isCompleted) return isDarkTheme ? Color.darkThm.success : Color.lightThm.success;
      if (isNext) return isDarkTheme ? Color.darkThm.accent : Color.lightThm.accent;
      return Color.setRgbOpacity(isDarkTheme ? Color.darkThm.txt : Color.lightThm.txt, 0.5);
   }};
`;
