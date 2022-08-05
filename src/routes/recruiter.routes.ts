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

router.post('/login', [
    check('email').not().isEmpty().trim(),
    check('password').not().isEmpty()
], login);

router.post('/signup', [
    body('*').trim(),
    check('company_name'),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({ min: 6 }),
    check('securityQuestion').not().isEmpty(),
    check('securityAnswer').isLength({ min: 4 }),
], signup);

router.put('/update', [
    body('*').trim(),
    check('company_name'),
    check('description'),
    check('address'),
    check('meta'),
    check('images'),
    check('logo'),
], updateUserData);

router.get('/whoami', [], whoami);

router.get('/get-ads', [], getAds);

// router.use(simpleUserAuth);

router.get('/get-security-question', [], getSecurityQuestion);

router.delete('/delete-account', [
    check('answer').not().isEmpty(),
], deleteAccount);

router.post('/create-new-ad', [
    check('title').not().isEmpty(),
    check('description').not().isEmpty(),
    check('meta'),
    check('salary').not().isEmpty(),
    check('location').not().isEmpty(),
    check('expiresOn').isString().not().isEmpty(),
    check('isPremium').isBoolean(),
    check('images'),
], createNewAd);

router.put('/update-ad/:adId', [
    check('title').not().isEmpty(),
    check('description').not().isEmpty(),
    check('meta'),
    check('salary').not().isEmpty(),
    check('location').not().isEmpty(),
    check('expiresOn').isString().not().isEmpty(),
    check('isPremium').isBoolean(),
    check('images'),
], updateAd);

router.delete('/delete-ad/:adId', [], deleteAd);

export default router;
