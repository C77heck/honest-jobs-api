import express from 'express';
export declare const validate: (req: express.Request) => {
    errors: any;
    isValid: boolean;
};
