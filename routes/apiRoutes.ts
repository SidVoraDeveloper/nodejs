import { Router } from 'express';
import UserController from '../controllers/userController';
import PostController from '../controllers/postController';
import Validator from '../middlewares/validators/validator';
import AuthMiddleware from '../middlewares/authentication/auth';
import AwsController from '../controllers/awsController';
import multer from 'multer';
import AmazonWebServices from '../controllers/awsController';
import ResourceController from '../controllers/resourceController';
import ClubController from '../controllers/clubController';
import ActionController from '../controllers/actionController';
import NotificationMiddleware from '../middlewares/application/notification';
//const dotenv = require('dotenv');

class ApiRoutes {
  public router: Router;

  public userController: UserController = new UserController();

  public postController: PostController = new PostController();

  public resourceController: ResourceController = new ResourceController();

  public clubController: ClubController = new ClubController();

  public actionController: ActionController = new ActionController();

  public validator: Validator = new Validator();

  public authMiddleware: AuthMiddleware = new AuthMiddleware();

  public notificationMiddleware: NotificationMiddleware = new NotificationMiddleware();

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {
    this.router.get('/posts', this.authMiddleware.authenticateJWT, this.postController.getPosts.bind(this.postController));
    this.router.post('/post', this.authMiddleware.authenticateJWT, AmazonWebServices.uploadPost, this.postController.upload.bind(this.postController));
    this.router.get('/profile/:id', this.authMiddleware.authenticateJWT, this.userController.getUserProfile.bind(this.userController));
    this.router.post('/profile/update/:id', this.authMiddleware.authenticateJWT, AwsController.upload, this.userController.updateProfile.bind(this.userController));
    this.router.get('/club/:id', this.authMiddleware.authenticateJWT, this.clubController.getClubProfile.bind(this.clubController));
    this.router.post('/club/update/:id', this.authMiddleware.authenticateJWT, this.clubController.updateProfile.bind(this.userController));
    this.router.get('/userposts', this.authMiddleware.authenticateJWT, this.postController.getUserPosts.bind(this.userController));
    this.router.get('/getusers', this.authMiddleware.authenticateJWT, this.userController.getUsersList.bind(this.userController));
    this.router.get('/userclubs', this.authMiddleware.authenticateJWT, this.clubController.getUserClubs.bind(this.clubController));
    this.router.get('/sports', this.resourceController.getSports.bind(this.resourceController));
    this.router.post('/like', this.authMiddleware.authenticateJWT, this.notificationMiddleware.liked.bind(this.notificationMiddleware), this.actionController.like.bind(this.actionController));
    this.router.post('/unlike', this.authMiddleware.authenticateJWT, this.actionController.unLike.bind(this.actionController));
    this.router.post('/comment', this.authMiddleware.authenticateJWT, this.actionController.comment.bind(this.actionController))
    this.router.post('/follow', this.authMiddleware.authenticateJWT, this.notificationMiddleware.followed.bind(this.notificationMiddleware), this.actionController.follow.bind(this.actionController));
    this.router.post('/followclub', this.authMiddleware.authenticateJWT, this.actionController.followClub.bind(this.actionController));
    this.router.post('/invite', this.authMiddleware.authenticateJWT, this.actionController.inviteToClub.bind(this.actionController));
    this.router.get('/notifications', this.authMiddleware.authenticateJWT, this.userController.getNotifications.bind(this.userController));
    this.router.post('/contactlist', this.authMiddleware.authenticateJWT, this.userController.addContactList.bind(this.userController));
    this.router.get('/contactlist', this.authMiddleware.authenticateJWT, this.userController.getContactList.bind(this.userController));
    //this.router.get('/profile/:id/update', this.authMiddleware.authenticateJWT, this.userController.updateProfile.bind(this.userController));
    //this.router.get('/explore/users', this.authMiddleware.authenticateJWT, this.userController)
  }
}

export default ApiRoutes;
