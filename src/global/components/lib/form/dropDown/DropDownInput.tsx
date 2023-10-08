import { useState } from 'react';
import useThemeContext from '../../../../context/theme/hooks/useThemeContext';
import { ErrorLabel, InputContainer, InputLabel, LabelWrapper } from '../input/Style';
import { DropDownArrow, DropDownLabelWrapper, StyledOption, StyledSelect } from './Style';

export interface IDropDownOption {
   value: string;
   label: string;
}

interface IDropDownInput {
   placeholder: string;
   name: string;
   isRequired?: boolean;
   handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
   error: string;
   options: IDropDownOption[];
   id: string;
   value: string | number;
}

export default function DropDownInput(props: IDropDownInput) {
   const { placeholder, name, isRequired, handleChange, error, options, id, value } = props;
   const { isDarkTheme } = useThemeContext();
   const [isActive, setIsActive] = useState(false);
   const [isEmpty, setIsEmpty] = useState(true);
   function handleFocus(): void {
      setIsActive(true);
   }

   function handleBlur(): void {
      setIsActive(false);
   }

   function selectCurrentValue(e: React.ChangeEvent<HTMLSelectElement>): void {
      setIsEmpty(e.target.value === '');
      handleChange(e);
   }

   return (
      <InputContainer>
         <DropDownLabelWrapper htmlFor={id || name}>
            <InputLabel
               focusedInput={isActive}
               isRequired={isRequired || false}
               inputHasValue={!isEmpty || !!value}
               isDarkTheme={isDarkTheme}
            >
               {placeholder}
            </InputLabel>
            <DropDownArrow darktheme={isDarkTheme.toString()} focusedinput={isActive.toString()} />
         </DropDownLabelWrapper>
         <StyledSelect
            name={name}
            onChange={selectCurrentValue}
            id={id}
            hasError={!!error}
            isDarkTheme={isDarkTheme}
            onFocus={handleFocus}
            onBlur={handleBlur}
            isRequired={isRequired || false}
            value={value}
         >
            <StyledOption isDarkTheme={isDarkTheme} value="" hidden={isRequired || false} />
            {options.map((option) => (
               <StyledOption isDarkTheme={isDarkTheme} value={option.value} key={option.value}>
                  {option.label}
               </StyledOption>
            ))}
         </StyledSelect>
         <ErrorLabel isDarkTheme={isDarkTheme}>{error}</ErrorLabel>
      </InputContainer>
   );
}
