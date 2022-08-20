import { ExpressRouter } from '@routes/libs/express.router';
import { NextFunction, Request, Response } from 'express';

const express = require('express');
const { check, body } = require('express-validator');

class RecruiterRouter extends ExpressRouter {
    public initializeRouter() {
        this.router.post('/login', [
            check('email').not().isEmpty().trim(),
            check('password').not().isEmpty()
        ], (req: Request, res: Response, next: NextFunction) => this.recruiterController.login(req, res, next));

        this.router.post('/signup', [
            body('*').trim(),
            check('company_name'),
            check('email').normalizeEmail().isEmail(),
            check('password').isLength({ min: 6 }),
            check('securityQuestion').not().isEmpty(),
            check('securityAnswer').isLength({ min: 4 }),
        ], (req: Request, res: Response, next: NextFunction) => this.recruiterController.signup(req, res, next));

        this.router.put('/update', [
            body('*').trim(),
            check('company_name'),
            check('description'),
            check('address'),
            check('meta'),
            check('images'),
            check('logo'),
        ], (req: Request, res: Response, next: NextFunction) => this.recruiterController.updateUserData(req, res, next));

        this.router.get('/whoami', [], (req: Request, res: Response, next: NextFunction) => this.recruiterController.whoami(req, res, next));

        this.router.get('/get-ads', [], (req: Request, res: Response, next: NextFunction) => this.recruiterController.getAds(req, res, next));

// this.router.use(simpleUserAuth);

        this.router.get('/get-security-question', [], (req: Request, res: Response, next: NextFunction) => this.recruiterController.getSecurityQuestion(req, res, next));

        this.router.delete('/delete-account', [
            check('answer').not().isEmpty(),
        ], (req: Request, res: Response, next: NextFunction) => this.recruiterController.deleteAccount(req, res, next));

        this.router.post('/create-new-ad', [
            check('title').not().isEmpty(),
            check('description').not().isEmpty(),
            check('meta'),
            check('salary').not().isEmpty(),
            check('location').not().isEmpty(),
            check('expiresOn').isString().not().isEmpty(),
            check('isPremium').isBoolean(),
            check('images'),
        ], (req: Request, res: Response, next: NextFunction) => this.recruiterController.createNewAd(req, res, next));

        this.router.put('/update-ad/:adId', [
            check('title').not().isEmpty(),
            check('description').not().isEmpty(),
            check('meta'),
            check('salary').not().isEmpty(),
            check('location').not().isEmpty(),
            check('expiresOn').isString().not().isEmpty(),
            check('isPremium').isBoolean(),
            check('images'),
        ], (req: Request, res: Response, next: NextFunction) => this.recruiterController.updateAd(req, res, next));

        this.router.delete('/delete-ad/:adId', [], (req: Request, res: Response, next: NextFunction) => this.recruiterController.deleteAd(req, res, next));
    }
}

export default new RecruiterRouter();
