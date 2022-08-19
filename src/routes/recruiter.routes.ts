import { ExpressRouter } from '@routes/libs/express.router';
import {
    createNewAd,
    deleteAccount,
    deleteAd,
    getAds,
    getSecurityQuestion,
    login,
    signup,
    updateAd,
    updateUserData,
    whoami
} from '../controllers/recruiter.controller';

const express = require('express');
const { check, body } = require('express-validator');

const router = express.Router();

class RecruiterRouter extends ExpressRouter {

    public initializeRouter() {

        this.router.post('/login', [
            check('email').not().isEmpty().trim(),
            check('password').not().isEmpty()
        ], login);

        this.router.post('/signup', [
            body('*').trim(),
            check('company_name'),
            check('email').normalizeEmail().isEmail(),
            check('password').isLength({ min: 6 }),
            check('securityQuestion').not().isEmpty(),
            check('securityAnswer').isLength({ min: 4 }),
        ], signup);

        this.router.put('/update', [
            body('*').trim(),
            check('company_name'),
            check('description'),
            check('address'),
            check('meta'),
            check('images'),
            check('logo'),
        ], updateUserData);

        this.router.get('/whoami', [], whoami);

        this.router.get('/get-ads', [], getAds);

// this.router.use(simpleUserAuth);

        this.router.get('/get-security-question', [], getSecurityQuestion);

        this.router.delete('/delete-account', [
            check('answer').not().isEmpty(),
        ], deleteAccount);

        this.router.post('/create-new-ad', [
            check('title').not().isEmpty(),
            check('description').not().isEmpty(),
            check('meta'),
            check('salary').not().isEmpty(),
            check('location').not().isEmpty(),
            check('expiresOn').isString().not().isEmpty(),
            check('isPremium').isBoolean(),
            check('images'),
        ], createNewAd);

        this.router.put('/update-ad/:adId', [
            check('title').not().isEmpty(),
            check('description').not().isEmpty(),
            check('meta'),
            check('salary').not().isEmpty(),
            check('location').not().isEmpty(),
            check('expiresOn').isString().not().isEmpty(),
            check('isPremium').isBoolean(),
            check('images'),
        ], updateAd);

        this.router.delete('/delete-ad/:adId', [], deleteAd);
    }
}

export default new RecruiterRouter();
