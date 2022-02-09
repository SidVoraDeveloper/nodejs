"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_validator_1 = require("express-validator");
var Validator = /** @class */ (function () {
    function Validator() {
        this.validateUser = [
            (0, express_validator_1.body)('email').isEmail().withMessage('Check your email'),
            (0, express_validator_1.body)('password').isLength({ min: 6 }).withMessage('Password minimum length: 6'),
            (0, express_validator_1.body)('name').isLength({ min: 2 }).withMessage('Check your name'),
            (0, express_validator_1.body)('username').isLength({ min: 2 }).withMessage('Check your username'),
            this.errorCheck,
        ];
        this.validateLogin = [
            (0, express_validator_1.body)('email').isEmail().withMessage('Check your email'),
            (0, express_validator_1.body)('password').isLength({ min: 6 }).withMessage('Password minimum length: 6'),
            this.errorCheck,
        ];
        // public profileUpdate = [
        //   body('name').isAlpha().withMessage('Check your email'),
        //   body('age'),
        //   this.errorCheck,
        // ];
        this.login = [
            (0, express_validator_1.body)('mobile').isNumeric().withMessage('Mobile should be numeric value'),
            (0, express_validator_1.body)('mobile').isLength({ min: 10, max: 10 }).withMessage('Mobile length should 10 digit'),
            this.errorCheck,
        ];
    }
    Validator.prototype.errorCheck = function (req, res, next) {
        var errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty())
            return res.status(422).json({ errors: errors.array() });
        return next();
    };
    return Validator;
}());
exports.default = Validator;
