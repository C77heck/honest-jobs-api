import { ExpressRouter } from '@routes/libs/express.router';

const { check, body } = require('express-validator');

class JobSeekerRouter extends ExpressRouter {
    public initializeRouter() {
        this.router.post('/login', [
            check('email').not().isEmpty().escape().trim(),
            check('password').not().isEmpty()
        ], this.jobSeekerController.login);

        this.router.post('/signup', [
            body('*').trim(),
            check('first_name'),
            check('last_name'),
            check('email').normalizeEmail().isEmail(),
            check('password').isLength({ min: 6 }),
            check('securityQuestion').not().isEmpty().escape(),
            check('securityAnswer').isLength({ min: 4 }),
        ], this.jobSeekerController.signup);

// this.router.use(simpleUserAuth);
        this.router.put('/update', [
            body('*').trim(),
            check('first_name').escape(),
            check('last_name').escape(),
            check('description').escape(),
            check('meta').escape(),
            check('images'),
            check('resume'),
            check('other_uploads'),
        ], this.jobSeekerController.updateUserData);

        this.router.get('/whoami', [], this.jobSeekerController.whoami);

        this.router.get('/get-security-question', [], this.jobSeekerController.getSecurityQuestion);

        this.router.delete('/delete-account', [
            check('answer').not().isEmpty(),
        ], this.jobSeekerController.deleteAccount);
    }
}

export default new JobSeekerRouter();
