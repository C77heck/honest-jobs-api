import {
    deleteAccount,
    getJobSeekers,
    getRecruiters,
    getSecurityQuestion,
    getUserData,
    updateUserData,
    whoami
} from '../controllers/user-controller';

const express = require('express');
const { check, body } = require('express-validator');
const { login, signup } = require('../controllers/user-controller');

const router = express.Router();

router.post('/login', [
    check('email').not().isEmpty().escape().trim(),
    check('password').not().isEmpty()
], login);

router.post('/signup', [
    body('*').trim(),
    check('company_name'),
    check('first_name'),
    check('last_name'),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({ min: 6 }),
    check('securityQuestion').not().isEmpty().escape(),
    check('securityAnswer').isLength({ min: 4 }),
    check('isRecruiter').isBoolean(),
    check('images'),
    check('resume'),
], signup);

// router.use(simpleUserAuth);

router.get('/whoami', [], whoami);

router.get('/get-recruiters', [], getRecruiters);

router.get('/get-user-data/:userId', [], getUserData);

router.get('/get-security-question', [], getSecurityQuestion);

router.put('/update', [
    body('*').trim(),
    check('company_name'),
    check('first_name').not().isEmpty(),
    check('last_name').not().isEmpty(),
    check('description').escape(),
    check('meta').escape(),
    check('images'),
    check('resume'),
], updateUserData);

router.delete('/delete-account', [
    check('answer').not().isEmpty(),
], deleteAccount);

// router.use(recruiterAuth);

router.get('/get-job-seekers', [], getJobSeekers);

export default router;
