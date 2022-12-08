export interface ValidationResponse {
    isValid: boolean;
    error: string;
}
export declare type ValidatorFunction = (value: any) => ValidationResponse;
export declare type LengthValidatorFunction = (length: number) => ValidatorFunction;
export declare const required: ValidatorFunction;
export declare const isNumber: ValidatorFunction;
export declare const isBoolean: ValidatorFunction;
export declare const isDate: ValidatorFunction;
export declare const isString: ValidatorFunction;
export declare const email: ValidatorFunction;
export declare const minLength: LengthValidatorFunction;
export declare const maxLength: LengthValidatorFunction;
