import { FirebaseError } from 'firebase/app';
import ObjectOfObjects from '../../../helpers/lib/dataTypes/objectOfObjects/objectsOfObjects';
import { auth } from '../../config/config';
import microservices from '../microservices/microservices';

export interface IAPICallerError {
   error: string;
}

export interface IAPICallerSuccessMsg {
   message: string;
}

export default class APIHelper {
   static createBody(keyValues: { [key: string]: unknown }): BodyInit {
      return JSON.stringify(keyValues);
   }

   static isSuccessMsgRes(response: unknown): response is IAPICallerSuccessMsg {
      return typeof response === 'object' && response !== null && 'message' in response;
   }

   static isAPICallerErrorRes(response: unknown): response is IAPICallerError {
      return (
         typeof response === 'object' &&
         response !== null &&
         'error' in response &&
         typeof (response as IAPICallerError).error === 'string'
      );
   }

   static handleError(error: unknown): string {
      if (error === null) {
         return 'Unknown Error: null';
      }
      if (error instanceof FirebaseError || (typeof error === 'object' && 'code' in error)) {
         const errorWithCode = error as { code: string };
         const errorMsgs: { [key: string]: string } = {
            'auth/wrong-password': 'Incorrect password',
            'auth/email-already-exists': 'User with this email already exists',
            'auth/invalid-password': 'Password must have at least 6 characters',
            'auth/user-not-found': 'User with this email does not exist',
            'auth/user-disabled': 'The user account has been disabled.',
            'auth/user-mismatch': 'Your current email is incorrect.',
            'auth/invalid-email': 'Your new email must be a valid email address',
            'auth/weak-password': 'Your password should be at least 6 characters long',
         };
         return errorMsgs[errorWithCode.code] || errorWithCode.code;
      }
      if (error != null && typeof error === 'object' && ('code' in error || 'message' in error)) {
         const errorMsgs: { [key: string]: string } = {
            'auth/email-already-exists': 'User with this email already exists',
         };
         const code = 'code' in error ? (error as { code: string }).code : '';
         const message = 'message' in error ? (error as { message: string }).message : '';
         return errorMsgs[code as string] || errorMsgs[message as string] || String(error);
      }

      if (typeof error === 'string') {
         return error;
      }
      return JSON.stringify(error);
   }

   async gatewayCall<T>(
      body: BodyInit | null | undefined,
      method: string,
      serviceName: string,
   ): Promise<T | IAPICallerError> {
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Microservice', serviceName);

      const microservice = ObjectOfObjects.findObjFromUniqueVal(microservices, serviceName);
      const los = microservice?.los;

      if (!los && los !== 0)
         return {
            error: 'Internal Client: Microservice misconfigured in microservices object',
         } as IAPICallerError;

      if (los > 1) {
         const idToken = await auth.currentUser?.getIdToken(true);
         if (!idToken) return { error: 'Unauthorized' } as IAPICallerError;
         headers.append('Authorization', `Bearer ${idToken}`);
      }

      const fetchUrl = body
         ? import.meta.env.VITE_ENDPOINT_GATEWAY_POST
         : `${import.meta.env.VITE_ENDPOINT_GATEWAY_GET}?${serviceName}`;
      const fetchParams = body ? { method, body, headers } : { method, headers };

      try {
         const response = await fetch(fetchUrl, fetchParams);
         if (!response.ok) {
            const errorMessage = await response.text();
            return { error: errorMessage } as IAPICallerError;
         }
         const data = await response.json();
         return data as T;
      } catch (error: unknown) {
         return { error: APIHelper.handleError(error) } as IAPICallerError;
      }
   }
}
