export interface ValidationResponse {
    isValid: boolean;
    error: string;
}

export type ValidatorFunction = (value: any) => ValidationResponse;

export const required: ValidatorFunction = (value: any): ValidationResponse => {
    if (!value) {
        return {
            isValid: false,
            error: 'Required'
        };
    }

    return {
        isValid: true,
        error: ''
    };
};

export const isNumber: ValidatorFunction = (value: any): ValidationResponse => {
    if (isNaN(+value)) {
        return {
            isValid: false,
            error: 'Must be number'
        };
    }

    return {
        isValid: true,
        error: ''
    };
};

export const isBoolean: ValidatorFunction = (value: any): ValidationResponse => {
    if (typeof value !== 'boolean') {
        return {
            isValid: false,
            error: 'Must be boolean'
        };
    }

    return {
        isValid: true,
        error: ''
    };
};

export const isString: ValidatorFunction = (value: any): ValidationResponse => {
    if (typeof value !== 'boolean') {
        return {
            isValid: false,
            error: 'Must be boolean'
        };
    }

    return {
        isValid: true,
        error: ''
    };
};

export const email: ValidatorFunction = (value: any): ValidationResponse => {
    const email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!email.test(value)) {
        return {
            isValid: false,
            error: 'Invalid email'
        };
    }

    return {
        isValid: true,
        error: ''
    };
};
