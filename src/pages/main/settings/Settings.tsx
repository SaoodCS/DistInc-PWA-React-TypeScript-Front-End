import useThemeContext from '../../../global/hooks/useThemeContext';

export default function Settings(): JSX.Element {
   const { isDarkTheme } = useThemeContext();
   return (
      <div style={{ color: !isDarkTheme ? 'white' : 'red' }}>
         Rendered when visiting &apos;/main/accounts/settings&apos;
      </div>
   );
}
