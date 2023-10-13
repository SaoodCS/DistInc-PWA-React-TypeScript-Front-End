import FormHelper, { InputArray } from '../../../../../../global/helpers/react/form/FormHelper';
import { ICurrentFormInputs } from '../../../../details/components/accounts/current/class/Class';

export default class DistributerClass {
   constructor(currentAccounts: ICurrentFormInputs[]) {
      this.currentAccounts = currentAccounts;
   }

   private currentAccounts: ICurrentFormInputs[];

   private inputs(): InputArray<{ [x: string]: number }> {
      const mappedCurrentAccounts = this.currentAccounts.map((currentAccount) => {
         return {
            name: currentAccount.id,
            id: `leftovers-${currentAccount.accountName}`,
            placeholder: `${currentAccount.accountName} Leftover Amount`,
            type: 'number',
            isRequired: true,
            validator: (value: number): string | true => {
               if (!value) return 'Leftover amount is required';
               if (value < 0) return 'Leftover amount cannot be negative';
               return true;
            },
         };
      });
      return mappedCurrentAccounts;
   }

   private initialState() {
      const inputs = this.inputs();
      const initialState = FormHelper.createInitialState(
         inputs as InputArray<{ [x: string]: number }>,
      );
      return initialState;
   }

   private initialErrors() {
      const inputs = this.inputs();
      const initialErrors = FormHelper.createInitialErrors(
         inputs as InputArray<{ [x: string]: number }>,
      );
      return initialErrors;
   }

   private validate(formValues: { [x: number]: number }) {
      const inputs = this.inputs();
      const formValidation = FormHelper.validation(
         formValues,
         inputs as InputArray<{ [x: string]: number }>,
      );
      return formValidation;
   }

   get form() {
      return {
         inputs: this.inputs(),
         initialState: this.initialState(),
         initialErrors: this.initialErrors(),
         validate: this.validate.bind(this),
      };
   }
}
