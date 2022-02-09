"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var userController_1 = __importDefault(require("../controllers/userController"));
var postController_1 = __importDefault(require("../controllers/postController"));
var clubController_1 = __importDefault(require("../controllers/clubController"));
var awsController_1 = __importDefault(require("../controllers/awsController"));
var validator_1 = __importDefault(require("../middlewares/validators/validator"));
var auth_1 = __importDefault(require("../middlewares/authentication/auth"));
//const dotenv = require('dotenv');
var dotenv_1 = __importDefault(require("dotenv"));
var multer_1 = __importDefault(require("multer"));
var AuthRoutes = /** @class */ (function () {
    function AuthRoutes() {
        this.upload = (0, multer_1.default)();
        this.userController = new userController_1.default();
        this.postController = new postController_1.default();
        this.clubController = new clubController_1.default();
        this.validator = new validator_1.default();
        this.authMiddleware = new auth_1.default();
        dotenv_1.default.config();
        this.router = (0, express_1.Router)();
        this.routes();
    }
    AuthRoutes.prototype.routes = function () {
        // this.router.post('/signup', AwsController.upload, this.userController.registerUser.bind(this.userController));
        this.router.post('/createclub', this.authMiddleware.authenticateJWT, awsController_1.default.upload, this.clubController.registerClub.bind(this.clubController));
        this.router.post('/login', this.validator.login, this.userController.authenticateUser.bind(this.userController));
        this.router.get('/user', this.authMiddleware.authenticateJWT, this.userController.getUser.bind(this.userController));
    };
    return AuthRoutes;
}());
exports.default = AuthRoutes;
