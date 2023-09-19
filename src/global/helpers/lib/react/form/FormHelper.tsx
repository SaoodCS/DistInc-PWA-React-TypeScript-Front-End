type InputObject<FieldName> = {
   name: FieldName;
   placeholder: string;
   type: string;
   isRequired: boolean;
   validator: (value: any) => string | true;
};

export type InputArray<FormInputs> = {
   [FieldName in keyof FormInputs]: InputObject<FieldName>;
}[keyof FormInputs][];

export default class FormHelper {
   static createInitialState<T>(arr: InputArray<T>): T {
      const initialState: any = {};
      arr.forEach((input) => {
         if (input.type === 'checkbox') {
            initialState[input.name] = false;
         }
         if (input.type === 'password' || input.type === 'email' || input.type === 'text') {
            initialState[input.name] = '';
         }
         if (input.type === 'number') {
            initialState[input.name] = 0;
         }
      });
      return initialState as T;
   }

   static createInitialErrors<T>(arr: InputArray<T>): Record<keyof T, string> {
      const errors: Record<keyof T, string> = {} as Record<keyof T, string>;
      arr.forEach((input) => {
         errors[input.name] = '';
      });
      return errors;
   }

   static validation<T>(formStateVal: T, formInputsArr: InputArray<T>): Record<keyof T, string> {
      const validated = formInputsArr.map((input) => {
         const validationValue = input.validator(formStateVal[input.name]);

         return { [input.name]: validationValue === true ? '' : validationValue };
      });
      return Object.assign({}, ...validated);
   }

   static hasNoErrors<T>(errors: Record<keyof T, string>): boolean {
      return Object.values(errors).every((error) => error === '');
   }
}
