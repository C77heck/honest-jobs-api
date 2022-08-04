import {
    createNewAd,
    deleteAccount,
    deleteAd,
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
    check('email').not().isEmpty().escape().trim(),
    check('password').not().isEmpty()
], login);

router.post('/signup', [
    body('*').trim(),
    check('company_name'),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({ min: 6 }),
    check('securityQuestion').not().isEmpty().escape(),
    check('securityAnswer').isLength({ min: 4 }),
], signup);

router.put('/update', [
    body('*').trim(),
    check('company_name').escape(),
    check('description').escape(),
    check('address').escape(),
    check('meta').escape(),
    check('images'),
    check('logo'),
], updateUserData);

router.get('/whoami', [], whoami);

// router.use(simpleUserAuth);

router.get('/get-security-question', [], getSecurityQuestion);

router.delete('/delete-account', [
    check('answer').not().isEmpty(),
], deleteAccount);

router.post('/create-new-ad', [
    check('title').not().isEmpty().escape(),
    check('description').not().isEmpty().escape(),
    check('meta').escape(),
    check('salary').not().isEmpty().escape(),
    check('location').not().isEmpty().escape(),
    check('expiresOn').isString().not().isEmpty().escape(),
    check('isPremium').isBoolean(),
    check('images'),
], createNewAd);

router.put('/update-ad/:adId', [
    check('title').not().isEmpty().escape(),
    check('description').not().isEmpty().escape(),
    check('meta').escape(),
    check('salary').not().isEmpty().escape(),
    check('location').not().isEmpty().escape(),
    check('expiresOn').isString().not().isEmpty().escape(),
    check('isPremium').isBoolean(),
    check('images'),
], updateAd);

router.delete('/delete-ad/:adId', [], deleteAd);

export default router;
