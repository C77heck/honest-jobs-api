import {
    deleteAccount,
    getSecurityQuestion,
    getUserData,
    updateUserData
} from '../controllers/user-controller';

const express = require('express');
const { check, body } = require('express-validator');
const { login, signup } = require('../controllers/user-controller');
const router = express.Router();

router.post('/login',
    [
        check('email').not().isEmpty().escape().trim(),
        check('password').not().isEmpty()
    ], login);

router.post('/signup', [
    body('*').trim().escape(),
    check('name').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({ min: 6 }),
    check('securityQuestion').not().isEmpty().escape(),
    check('securityAnswer').isLength({ min: 4 }),
    check('isEmployer').isBoolean()
], signup);

router.get('/get-user-data/:userId', [], getUserData);

router.get('/get-security-question/:userId', [], getSecurityQuestion);

router.put('/update/:userId', [
    body('*').trim().escape(),
    check('name').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({ min: 6 }),
    check('securityQuestion').not().isEmpty().escape(),
    check('securityAnswer').isLength({ min: 4 }),
    check('isEmployer').isBoolean()
], updateUserData);

router.delete('/delete-account/:userId', [
    check('answer').not().isEmpty(),
], deleteAccount);

export default router;
