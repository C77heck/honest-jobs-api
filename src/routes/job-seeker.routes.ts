import {
    deleteAccount,
    getSecurityQuestion,
    login,
    signup,
    updateUserData,
    whoami
} from '../controllers/job-seeker.controller';

const express = require('express');
const { check, body } = require('express-validator');

const router = express.Router();

router.post('/login', [
    check('email').not().isEmpty().escape().trim(),
    check('password').not().isEmpty()
], login);

// perhaps split this between roles.
router.post('/signup', [
    body('*').trim(),
    check('first_name'),
    check('last_name'),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({ min: 6 }),
    check('securityQuestion').not().isEmpty().escape(),
    check('securityAnswer').isLength({ min: 4 }),
], signup);

// router.use(simpleUserAuth);
router.put('/update', [
    body('*').trim(),
    check('first_name').escape(),
    check('last_name').escape(),
    check('description').escape(),
    check('meta').escape(),
    check('images'),
    check('resume'),
    check('other_uploads'),
], updateUserData);

router.get('/whoami', [], whoami);

router.get('/get-security-question', [], getSecurityQuestion);

router.delete('/delete-account', [
    check('answer').not().isEmpty(),
], deleteAccount);

// TODO -> APPLYING LOGIC

export default router;
