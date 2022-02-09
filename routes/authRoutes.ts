import { Router } from 'express';
import UserController from '../controllers/userController';
import PostController from '../controllers/postController';
import ClubController from '../controllers/clubController';
import AwsController from '../controllers/awsController';
import Validator from '../middlewares/validators/validator';
import AuthMiddleware from '../middlewares/authentication/auth';
//const dotenv = require('dotenv');
import dotenv from 'dotenv';
import multer from 'multer';

class AuthRoutes {
  public router: Router;

  public upload = multer();

  public userController: UserController = new UserController();

  public postController: PostController = new PostController();

  public clubController: ClubController = new ClubController();

  public validator: Validator = new Validator();

  public authMiddleware: AuthMiddleware = new AuthMiddleware();

  constructor() {
    dotenv.config();
    this.router = Router();
    this.routes();
  }

  routes() {
    // this.router.post('/signup', AwsController.upload, this.userController.registerUser.bind(this.userController));
    this.router.post('/createclub', this.authMiddleware.authenticateJWT, AwsController.upload, this.clubController.registerClub.bind(this.clubController));
    this.router.post('/login', this.validator.login, this.userController.authenticateUser.bind(this.userController));
    this.router.get('/user', this.authMiddleware.authenticateJWT, this.userController.getUser.bind(this.userController));
  }
}

export default AuthRoutes;
