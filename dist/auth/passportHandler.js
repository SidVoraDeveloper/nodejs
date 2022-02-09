"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var passport_1 = __importDefault(require("passport"));
var passport_local_1 = __importDefault(require("passport-local"));
// import passportApiKey from "passport-headerapikey";
var passport_jwt_1 = __importDefault(require("passport-jwt"));
var client_1 = require("@prisma/client");
// import { User } from '../models/user';
var bcrypt_1 = __importDefault(require("bcrypt"));
var config_1 = __importDefault(require("../configs/config"));
var LocalStrategy = passport_local_1.default.Strategy;
var JwtStrategy = passport_jwt_1.default.Strategy;
var ExtractJwt = passport_jwt_1.default.ExtractJwt;
var prisma = new client_1.PrismaClient();
var isCorrectPassword = function (password, existing) {
    var hashedPassword = bcrypt_1.default.hashSync(password, bcrypt_1.default.genSaltSync(10));
    if (hashedPassword === existing) {
        return true;
    }
    return false;
};
passport_1.default.use(new LocalStrategy({ usernameField: 'mobile' }, function (mobile, password, done) { return __awaiter(void 0, void 0, void 0, function () {
    var usernameString;
    return __generator(this, function (_a) {
        usernameString = mobile;
        prisma.user.findUnique({
            where: { mobile: usernameString },
        }).then(function (user) {
            console.log(user);
            if (!user) {
                return done(undefined, false, { message: "mobile " + mobile + " not found." });
            }
            // if (isCorrectPassword(password, user.password)) {
            //   return done(undefined, user);
            // }
            return done(undefined, false, { message: 'invalid mobile' });
        }).catch(function (error) {
            console.log(error);
            return done(undefined, false);
        });
        return [2 /*return*/, done(undefined, false, { message: 'invalid mobile' })];
    });
}); }));
passport_1.default.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config_1.default.JWT_SECRET,
}, (function (jwtToken, done) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        prisma.user.findUnique({
            where: { mobile: jwtToken.mobile },
        }).then(function (user) {
            if (user) {
                return done(undefined, user, jwtToken);
            }
            return done(undefined, false);
        }).catch(function (error) {
            console.log(error);
            return done(undefined, false);
        });
        return [2 /*return*/];
    });
}); })));
