import { TextColourizer } from '../../../../../../global/components/lib/font/textColorizer/TextColourizer';
import { FlexColumnWrapper } from '../../../../../../global/components/lib/positionModifiers/flexColumnWrapper/FlexColumnWrapper';
import { VerticalSeperator } from '../../../../../../global/components/lib/positionModifiers/verticalSeperator/VerticalSeperator';

export default function UpdateNotifSettingsModal(): JSX.Element {
   return (
      <FlexColumnWrapper>
         <TextColourizer>
            As you have already set your notification permissions, visit your device settings to
            change them.
         </TextColourizer>
         <VerticalSeperator />
         <TextColourizer>
            Once you have changed your notification permissions, please refresh the application.
         </TextColourizer>
         <VerticalSeperator />
      </FlexColumnWrapper>
   );
}
