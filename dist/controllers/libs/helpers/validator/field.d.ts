import express from 'express';
import { FormatterFunction } from './formatters';
import { ValidatorFunction } from './validators';
export declare type ValidatorArgumentOptions = ValidatorFunction[];
export declare const field: (field: string, validators: ValidatorArgumentOptions, formatters: FormatterFunction<any>[], req: express.Request, res: express.Response, next: express.NextFunction) => void;
