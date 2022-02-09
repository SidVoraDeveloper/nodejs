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
var clubController_1 = __importDefault(require("../controllers/clubController"));
var exploreController_1 = __importDefault(require("../controllers/exploreController"));
//const dotenv = require('dotenv');
var ExploreRoutes = /** @class */ (function () {
    function ExploreRoutes() {
        this.userController = new userController_1.default();
        this.clubController = new clubController_1.default();
        this.postController = new postController_1.default();
        this.exploreController = new exploreController_1.default();
        this.validator = new validator_1.default();
        this.authMiddleware = new auth_1.default();
        this.router = (0, express_1.Router)();
        this.routes();
    }
    ExploreRoutes.prototype.routes = function () {
        this.router.get('/users', this.authMiddleware.authenticateJWT, this.userController.getUsersList.bind(this.userController));
        this.router.get('/clubs', this.authMiddleware.authenticateJWT, this.clubController.getClubsList.bind(this.clubController));
        this.router.get('/find', this.authMiddleware.authenticateJWT, this.exploreController.getClubsAndUsers.bind(this.exploreController));
    };
    return ExploreRoutes;
}());
exports.default = ExploreRoutes;
