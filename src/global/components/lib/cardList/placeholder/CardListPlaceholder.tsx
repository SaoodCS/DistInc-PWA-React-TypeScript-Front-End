import useThemeContext from '../../../../context/theme/hooks/useThemeContext';
import JSXHelper from '../../../../helpers/dataTypes/jsx/jsxHelper';
import { PlaceholderLine, PlaceholderRect } from '../../fetch/placeholders/Style';
import {
   CardListItem,
   CardListTitle,
   CardListWrapper,
   ItemRightColWrapper,
   ItemTitleAndIconWrapper,
   ItemTitleAndSubTitleWrapper,
} from '../Style';

interface ICardListPlaceholder {
   repeatItemCount: number;
}

export function CardListItemPlaceholder() {
   const { isDarkTheme } = useThemeContext();

   return (
      <CardListItem>
         <ItemTitleAndIconWrapper>
            <PlaceholderLine isDarkTheme={isDarkTheme} height="2em" width="2em" />
            <ItemTitleAndSubTitleWrapper>
               <PlaceholderLine isDarkTheme={isDarkTheme} width="10em" margin="0em 1em 0.5em" />
               <PlaceholderLine
                  isDarkTheme={isDarkTheme}
                  width="5em"
                  margin="0em 1em 0em"
                  height="0.5em"
               />
            </ItemTitleAndSubTitleWrapper>
         </ItemTitleAndIconWrapper>
         <ItemRightColWrapper>
            <PlaceholderLine isDarkTheme={isDarkTheme} height="5em" width="2em" />
            <PlaceholderLine isDarkTheme={isDarkTheme} height="5em" width="5em" />
         </ItemRightColWrapper>
      </CardListItem>
   );
}

export default function CardListPlaceholder(props: ICardListPlaceholder) {
   const { repeatItemCount } = props;
   const { isDarkTheme } = useThemeContext();
   return (
      <>
         <PlaceholderLine
            isDarkTheme={isDarkTheme}
            width="7em"
            height={'1em'}
            style={{
               paddingTop: '1em',
               marginLeft: '1em',
               paddingRight: '1em',
               marginTop: '1em',
            }}
         />
         <CardListWrapper>
            <CardListTitle>
               <PlaceholderLine isDarkTheme={isDarkTheme} width="5em" />
            </CardListTitle>
            {JSXHelper.repeatJSX(<CardListItemPlaceholder />, repeatItemCount)}
         </CardListWrapper>
      </>
   );
}