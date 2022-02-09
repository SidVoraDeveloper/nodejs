import { Router } from 'express';
import UserController from '../controllers/userController';
import PostController from '../controllers/postController';
import Validator from '../middlewares/validators/validator';
import AuthMiddleware from '../middlewares/authentication/auth';
import AwsController from '../controllers/awsController';
import multer from 'multer';
import AmazonWebServices from '../controllers/awsController';
import ClubController from '../controllers/clubController';
import ExploreController from '../controllers/exploreController';
//const dotenv = require('dotenv');

class ExploreRoutes {
  public router: Router;

  public userController: UserController = new UserController();

  public clubController: ClubController = new ClubController();

  public postController: PostController = new PostController();

  public exploreController: ExploreController = new ExploreController();

  public validator: Validator = new Validator();

  public authMiddleware: AuthMiddleware = new AuthMiddleware();

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {
    this.router.get('/users', this.authMiddleware.authenticateJWT, this.userController.getUsersList.bind(this.userController));
    this.router.get('/clubs', this.authMiddleware.authenticateJWT, this.clubController.getClubsList.bind(this.clubController));
    this.router.get('/find', this.authMiddleware.authenticateJWT, this.exploreController.getClubsAndUsers.bind(this.exploreController));
  }
}

export default ExploreRoutes;
