import { useState } from 'react';
import useThemeContext from '../../../../hooks/useThemeContext';
import { ErrorLabel, InputContainer, InputLabel, LabelWrapper, TextInput } from './Style';

interface IInput {
   placeholder: string;
   type: string;
   name: string;
   isRequired?: boolean;
   handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
   error: string;
   value: string | number;
   id?: string;
}

export default function InputComponent(props: IInput): JSX.Element {
   const { placeholder, type, name, isRequired, handleChange, value, error, id } = props;
   const [isActive, setIsActive] = useState(false);
   const { isDarkTheme } = useThemeContext();
   const preventSafariPwdGenerate = 'current-password';

   function handleFocus() {
      setIsActive(true);
   }

   function handleBlur() {
      setIsActive(false);
   }

   return (
      <InputContainer>
         <LabelWrapper htmlFor={id || name}>
            <InputLabel
               focusedInput={isActive}
               isRequired={isRequired || false}
               inputHasValue={!!value}
               isDarkTheme={isDarkTheme}
            >
               {placeholder}
            </InputLabel>
         </LabelWrapper>
         <TextInput
            id={id || name}
            onFocus={handleFocus}
            onBlur={handleBlur}
            type={type}
            name={name}
            isRequired={isRequired || false}
            onChange={handleChange}
            value={value}
            hasError={!!error}
            isDarkTheme={isDarkTheme}
            autoComplete={preventSafariPwdGenerate}
         />
         <ErrorLabel isDarkTheme={isDarkTheme}>{error}</ErrorLabel>
      </InputContainer>
   );
}
