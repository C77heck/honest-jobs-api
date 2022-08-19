import { ExpressRouter } from '@routes/libs/express.router';

const express = require('express');
const { check, body } = require('express-validator');

class RecruiterRouter extends ExpressRouter {
    public initializeRouter() {
        this.router.post('/login', [
            check('email').not().isEmpty().trim(),
            check('password').not().isEmpty()
        ], this.recruiterController.login);

        this.router.post('/signup', [
            body('*').trim(),
            check('company_name'),
            check('email').normalizeEmail().isEmail(),
            check('password').isLength({ min: 6 }),
            check('securityQuestion').not().isEmpty(),
            check('securityAnswer').isLength({ min: 4 }),
        ], this.recruiterController.signup);

        this.router.put('/update', [
            body('*').trim(),
            check('company_name'),
            check('description'),
            check('address'),
            check('meta'),
            check('images'),
            check('logo'),
        ], this.recruiterController.updateUserData);

        this.router.get('/whoami', [], this.recruiterController.whoami);

        this.router.get('/get-ads', [], this.recruiterController.getAds);

// this.router.use(simpleUserAuth);

        this.router.get('/get-security-question', [], this.recruiterController.getSecurityQuestion);

        this.router.delete('/delete-account', [
            check('answer').not().isEmpty(),
        ], this.recruiterController.deleteAccount);

        this.router.post('/create-new-ad', [
            check('title').not().isEmpty(),
            check('description').not().isEmpty(),
            check('meta'),
            check('salary').not().isEmpty(),
            check('location').not().isEmpty(),
            check('expiresOn').isString().not().isEmpty(),
            check('isPremium').isBoolean(),
            check('images'),
        ], this.recruiterController.createNewAd);

        this.router.put('/update-ad/:adId', [
            check('title').not().isEmpty(),
            check('description').not().isEmpty(),
            check('meta'),
            check('salary').not().isEmpty(),
            check('location').not().isEmpty(),
            check('expiresOn').isString().not().isEmpty(),
            check('isPremium').isBoolean(),
            check('images'),
        ], this.recruiterController.updateAd);

        this.router.delete('/delete-ad/:adId', [], this.recruiterController.deleteAd);
    }
}

export default new RecruiterRouter();
