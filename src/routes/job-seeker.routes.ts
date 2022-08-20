import { ExpressRouter } from '@routes/libs/express.router';
import { NextFunction, Request, Response } from 'express';

const { check, body } = require('express-validator');

class JobSeekerRouter extends ExpressRouter {
    public initializeRouter() {
        this.router.post('/login', [
            check('email').not().isEmpty().escape().trim(),
            check('password').not().isEmpty()
        ], (req: Request, res: Response, next: NextFunction) => this.jobSeekerController.login(req, res, next));

        this.router.post('/signup', [
            body('*').trim(),
            check('first_name'),
            check('last_name'),
            check('email').normalizeEmail().isEmail(),
            check('password').isLength({ min: 6 }),
            check('securityQuestion').not().isEmpty().escape(),
            check('securityAnswer').isLength({ min: 4 }),
        ], (req: Request, res: Response, next: NextFunction) => this.jobSeekerController.signup(req, res, next));

// this.router.use(simpleUserAuth(req, res, next));
        this.router.put('/update', [
            body('*').trim(),
            check('first_name').escape(),
            check('last_name').escape(),
            check('description').escape(),
            check('meta').escape(),
            check('images'),
            check('resume'),
            check('other_uploads'),
        ], (req: Request, res: Response, next: NextFunction) => this.jobSeekerController.updateUserData(req, res, next));

        this.router.get('/whoami', [], (req: Request, res: Response, next: NextFunction) => this.jobSeekerController.whoami(req, res, next));

        this.router.get('/get-security-question', [], (req: Request, res: Response, next: NextFunction) => this.jobSeekerController.getSecurityQuestion(req, res, next));

        this.router.delete('/delete-account', [
            check('answer').not().isEmpty(),
        ], (req: Request, res: Response, next: NextFunction) => this.jobSeekerController.deleteAccount(req, res, next));
    }
}

export default new JobSeekerRouter();
