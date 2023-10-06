import { PlaceholderLine } from '../../../../global/components/lib/fetch/placeholders/Style';
import useThemeContext from '../../../../global/context/theme/hooks/useThemeContext';
import {
   FirstRowWrapper,
   FlatListItem,
   ItemTitle,
   ItemTitleWrapper,
   ItemValue,
   SecondRowTagsWrapper,
} from '../components/style/Style';

export default function DetailsPlaceholder(): JSX.Element {
   const { isDarkTheme } = useThemeContext();
   return (
      <FlatListItem isDarkTheme={isDarkTheme}>
         <FirstRowWrapper style={{ marginBottom: '0.5em' }}>
            <ItemTitleWrapper>
               <ItemTitle>
                  <PlaceholderLine isDarkTheme={isDarkTheme} style={{ width: '50dvw' }} />
               </ItemTitle>
            </ItemTitleWrapper>
            <ItemValue>
               <PlaceholderLine isDarkTheme={isDarkTheme} style={{ width: '15dvw' }} />
            </ItemValue>
         </FirstRowWrapper>
         <SecondRowTagsWrapper>
            <PlaceholderLine
               isDarkTheme={isDarkTheme}
               style={{ width: '15dvw', marginRight: '0.5em' }}
            />
            <PlaceholderLine
               isDarkTheme={isDarkTheme}
               style={{ width: '15dvw', marginRight: '0.5em' }}
            />
            <PlaceholderLine
               isDarkTheme={isDarkTheme}
               style={{ width: '15dvw', marginRight: '0.5em' }}
            />
            <PlaceholderLine
               isDarkTheme={isDarkTheme}
               style={{ width: '15dvw', marginRight: '0.5em' }}
            />
         </SecondRowTagsWrapper>
      </FlatListItem>
   );
}
