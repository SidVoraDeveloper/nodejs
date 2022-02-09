import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
// import passport from 'passport';
// import LocalStrategy from 'passport-local';
import * as jwt from 'jsonwebtoken';
import config from '../configs/config';
import { IUser } from '../models/user';
import moment from 'moment-timezone';
import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';
import multerS3 from 'multer-s3';
import AmazonWebServices from './awsController';

const fileSizeLimit = 100000000;

class ResourceController {

  public amazonWebServices = new AmazonWebServices();

  public prisma: PrismaClient = new PrismaClient();

  /**
   * @swagger
   * tags:
   *   name: Resources
   *   description: Hiki public resources
   */

  /**
   * @swagger
   * /api/sports:
   *   get:
   *     description: Create new user and authenticate
   *     tags: [Resources]
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Returns all sports
   *         schema:
   *           type: object
   *           properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: The user ID.
 *                         example: 0
 *                       name:
 *                         type: string
 *                         description: The user's name.
 *                         example: Leanne Graham
   */

  public async getSports(req: Request, res: Response) {
    const tags  = await this.prisma.tags.findMany({
      select: {
        id: true,
        name: true,
        description: true,
      },
      where: {
          verified: true
      }
    });
    return res.json({ tags: tags});
  }
}


export default ResourceController;
