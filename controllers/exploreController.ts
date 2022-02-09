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

class ExploreController {

  public amazonWebServices = new AmazonWebServices();

  public prisma: PrismaClient = new PrismaClient();

  public async getClubsAndUsers(req: Request, res: Response) {
    const user = res.locals.user;
    const search = req.query.search!.toString();
    const users = await this.prisma.user.findMany({
        where: {
          name: {
            contains: search
          }
        },
        take: 10,
        select: {
          id: true,
          name: true,
          username: true,
          profile: {
            select: {
              description: true,
              media: true,
            }
          },
          followedBy: {
            where: {
              followedById: user.id
            }
          }  
        }
    });
    const clubs = await this.prisma.clubs.findMany({
      where: {
        name: {
          contains: search
        }
      },
      take: 10,
      select: {
          id: true,
          name: true,
          description: true,
          media: true,
          clubHasFollowers: {
          take: 5,
          select: {
              followedBy: {
              select: {
                  username: true,
                  profile: {
                  select: {
                      media: true,
                  }
                  }
              }
              }
          }
        },
        clubMembers: {
          select: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
                profile: {
                  select: {
                    media: true
                  }
                }
              }
            }
          }
        }
      }
    });

    return res.json({ clubs: clubs, users: users});
  }

    
}


export default ExploreController;
