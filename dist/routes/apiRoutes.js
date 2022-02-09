"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var userController_1 = __importDefault(require("../controllers/userController"));
var postController_1 = __importDefault(require("../controllers/postController"));
var validator_1 = __importDefault(require("../middlewares/validators/validator"));
var auth_1 = __importDefault(require("../middlewares/authentication/auth"));
var awsController_1 = __importDefault(require("../controllers/awsController"));
var awsController_2 = __importDefault(require("../controllers/awsController"));
var resourceController_1 = __importDefault(require("../controllers/resourceController"));
var clubController_1 = __importDefault(require("../controllers/clubController"));
var actionController_1 = __importDefault(require("../controllers/actionController"));
var notification_1 = __importDefault(require("../middlewares/application/notification"));
//const dotenv = require('dotenv');
var ApiRoutes = /** @class */ (function () {
    function ApiRoutes() {
        this.userController = new userController_1.default();
        this.postController = new postController_1.default();
        this.resourceController = new resourceController_1.default();
        this.clubController = new clubController_1.default();
        this.actionController = new actionController_1.default();
        this.validator = new validator_1.default();
        this.authMiddleware = new auth_1.default();
        this.notificationMiddleware = new notification_1.default();
        this.router = (0, express_1.Router)();
        this.routes();
    }
    ApiRoutes.prototype.routes = function () {
        this.router.get('/posts', this.authMiddleware.authenticateJWT, this.postController.getPosts.bind(this.postController));
        this.router.post('/post', this.authMiddleware.authenticateJWT, awsController_2.default.uploadPost, this.postController.upload.bind(this.postController));
        this.router.get('/profile/:id', this.authMiddleware.authenticateJWT, this.userController.getUserProfile.bind(this.userController));
        this.router.post('/profile/update/:id', this.authMiddleware.authenticateJWT, awsController_1.default.upload, this.userController.updateProfile.bind(this.userController));
        this.router.get('/club/:id', this.authMiddleware.authenticateJWT, this.clubController.getClubProfile.bind(this.clubController));
        this.router.post('/club/update/:id', this.authMiddleware.authenticateJWT, this.clubController.updateProfile.bind(this.userController));
        this.router.get('/userposts', this.authMiddleware.authenticateJWT, this.postController.getUserPosts.bind(this.userController));
        this.router.get('/getusers', this.authMiddleware.authenticateJWT, this.userController.getUsersList.bind(this.userController));
        this.router.get('/userclubs', this.authMiddleware.authenticateJWT, this.clubController.getUserClubs.bind(this.clubController));
        this.router.get('/sports', this.resourceController.getSports.bind(this.resourceController));
        this.router.post('/like', this.authMiddleware.authenticateJWT, this.notificationMiddleware.liked.bind(this.notificationMiddleware), this.actionController.like.bind(this.actionController));
        this.router.post('/unlike', this.authMiddleware.authenticateJWT, this.actionController.unLike.bind(this.actionController));
        this.router.post('/comment', this.authMiddleware.authenticateJWT, this.actionController.comment.bind(this.actionController));
        this.router.post('/follow', this.authMiddleware.authenticateJWT, this.notificationMiddleware.followed.bind(this.notificationMiddleware), this.actionController.follow.bind(this.actionController));
        this.router.post('/followclub', this.authMiddleware.authenticateJWT, this.actionController.followClub.bind(this.actionController));
        this.router.post('/invite', this.authMiddleware.authenticateJWT, this.actionController.inviteToClub.bind(this.actionController));
        this.router.get('/notifications', this.authMiddleware.authenticateJWT, this.userController.getNotifications.bind(this.userController));
        this.router.post('/contactlist', this.authMiddleware.authenticateJWT, this.userController.addContactList.bind(this.userController));
        this.router.get('/contactlist', this.authMiddleware.authenticateJWT, this.userController.getContactList.bind(this.userController));
        //this.router.get('/profile/:id/update', this.authMiddleware.authenticateJWT, this.userController.updateProfile.bind(this.userController));
        //this.router.get('/explore/users', this.authMiddleware.authenticateJWT, this.userController)
    };
    return ApiRoutes;
}());
exports.default = ApiRoutes;
