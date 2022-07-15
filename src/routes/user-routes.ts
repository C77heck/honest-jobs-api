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
    body('*').trim().escape(),
    check('first_name').not().isEmpty(),
    check('last_name').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({ min: 6 }),
    check('securityQuestion').not().isEmpty().escape(),
    check('securityAnswer').isLength({ min: 4 }),
    check('isRecruiter').isBoolean(),
    // check('images').escape(), // TODO -> we will need a cdn microservice here to return a string url
    // check('resume').escape(), // TODO -> we will need the cdn return here
], signup);

// router.use(simpleUserAuth);

router.get('/whoami', [], whoami);

router.get('/get-recruiters', [], getRecruiters);

router.get('/get-user-data/:userId', [], getUserData);

router.get('/get-security-question', [], getSecurityQuestion);

router.put('/update', [
    body('*').trim().escape(),
    check('first_name').not().isEmpty(),
    check('last_name').not().isEmpty(),
    check('description').escape(),
    check('meta').escape(),
    check('images').escape(), // TODO -> we will need a cdn microservice here to return a string url
    check('resume').escape(),
], updateUserData);

router.delete('/delete-account', [
    check('answer').not().isEmpty(),
], deleteAccount);

// router.use(recruiterAuth);

router.get('/get-job-seekers', [], getJobSeekers);

export default router;
