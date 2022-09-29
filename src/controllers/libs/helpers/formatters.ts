import express from 'express';

export class Formatters {
    public static trim(field: string, req: express.Request, res: express.Response, next: express.NextFunction) {
        const fieldValue = req.body?.[field];
        req.body[field] = fieldValue.trim();
        next();
    }

    public static escape(field: string, req: express.Request, res: express.Response, next: express.NextFunction) {
        const fieldValue = req.body?.[field];
        req.body[field] = fieldValue.trim();
        next();
    }
}
