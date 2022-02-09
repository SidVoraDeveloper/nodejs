import { validationResult, body } from 'express-validator';

class Validator {
    public validateUser = [
      body('email').isEmail().withMessage('Check your email'),
      body('password').isLength({ min: 6 }).withMessage('Password minimum length: 6'),
      body('name').isLength({ min: 2 }).withMessage('Check your name'),
      body('username').isLength({ min: 2 }).withMessage('Check your username'),
      this.errorCheck,
    ];
    public validateLogin = [
      body('email').isEmail().withMessage('Check your email'),
      body('password').isLength({ min: 6 }).withMessage('Password minimum length: 6'),
      this.errorCheck,
    ];
    // public profileUpdate = [
    //   body('name').isAlpha().withMessage('Check your email'),
    //   body('age'),
    //   this.errorCheck,
    // ];
    public login = [
      body('mobile').isNumeric().withMessage('Mobile should be numeric value'),
      body('mobile').isLength({ min: 10, max:10 }).withMessage('Mobile length should 10 digit'),
      this.errorCheck,
    ];


    public errorCheck(req: any, res: any, next: any) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
      return next();
    }
}

export default Validator;
