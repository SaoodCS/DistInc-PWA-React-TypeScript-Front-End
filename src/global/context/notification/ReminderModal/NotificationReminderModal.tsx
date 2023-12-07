import { StyledLink } from '../../../components/app/layout/footer/Style';
import { TextBtn } from '../../../components/lib/button/textBtn/Style';
import { TextColourizer } from '../../../components/lib/font/textColorizer/TextColourizer';
import { FlexColumnWrapper } from '../../../components/lib/positionModifiers/flexColumnWrapper/FlexColumnWrapper';
import { VerticalSeperator } from '../../../components/lib/positionModifiers/verticalSeperator/VerticalSeperator';
import useThemeContext from '../../theme/hooks/useThemeContext';

interface INotificationReminderModal {
   toggleModal: (toggle: boolean) => void;
}
export default function NotificationReminderModal(props: INotificationReminderModal): JSX.Element {
   const { toggleModal } = props;
   const { isDarkTheme } = useThemeContext();
   return (
      <>
         <TextColourizer>You are due to distribute your income!</TextColourizer>
         <VerticalSeperator margBottomEm={1} />
         <StyledLink to="main/distribute">
            <FlexColumnWrapper alignItems="end">
               <TextBtn isDarkTheme={isDarkTheme} onClick={() => toggleModal(false)}>
                  Go to Distribute
               </TextBtn>
            </FlexColumnWrapper>
         </StyledLink>
      </>
   );
}
