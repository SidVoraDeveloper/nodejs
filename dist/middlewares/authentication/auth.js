"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var passport_1 = __importDefault(require("passport"));
require("../../auth/passportHandler");
var AuthMiddleware = /** @class */ (function () {
    function AuthMiddleware() {
    }
    AuthMiddleware.prototype.authenticateJWT = function (req, res, next) {
        passport_1.default.authenticate('jwt', function (err, user, info) {
            console.log(info);
            if (err) {
                console.log(err);
                return res.status(401).json({ status: 'error', code: 'unauthorized' });
            }
            if (!user) {
                return res.status(401).json({ status: 'error', code: 'unauthorized' });
            }
            res.locals.user = user;
            return next();
        })(req, res, next);
    };
    AuthMiddleware.prototype.authorizeJWT = function (req, res, next) {
        passport_1.default.authenticate('jwt', function (err, user, jwtToken) {
            if (err) {
                console.log(err);
                return res.status(401).json({ status: 'error', code: 'unauthorized' });
            }
            if (!user) {
                return res.status(401).json({ status: 'error', code: 'unauthorized' });
            }
            var scope = req.baseUrl.split('/').slice(-1)[0];
            var authScope = jwtToken.scope;
            if (authScope && authScope.indexOf(scope) > -1) {
                res.locals.user = user;
                return next();
            }
            return res.status(401).json({ status: 'error', code: 'unauthorized' });
        })(req, res, next);
    };
    return AuthMiddleware;
}());
exports.default = AuthMiddleware;
