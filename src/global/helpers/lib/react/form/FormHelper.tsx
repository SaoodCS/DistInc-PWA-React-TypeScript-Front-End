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

type FormErrors = {
   [key: string]: string;
};

export default class FormHelper {
   static createInitialState(arr: any[]) {
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
      return initialState;
   }

   static createInitialErrors(arr: any[]): FormErrors {
      const errors: any = {};
      arr.forEach((input) => {
         errors[input.name] = '';
      });
      return errors;
   }

   static validation(formStateVal: any, formInputsArr: any[]): FormErrors {
      const validated = formInputsArr.map((input) => {
         const validationValue = input.validator(formStateVal[input.name]);

         return { [input.name]: validationValue === true ? '' : validationValue };
      });
      return Object.assign({}, ...validated);
   }

   static hasNoErrors(errors: any): boolean {
      return Object.values(errors).every((error) => error === '');
   }
}