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

class ActionController {

  public amazonWebServices = new AmazonWebServices();

  public prisma: PrismaClient = new PrismaClient();

  /**
   * @swagger
   * tags:
   *   name: Action routes
   *   description: For example, like, follow etc.
   */

  public async follow(req: Request, res: Response) {
    const toFollow = req.body.user_id;
    const user = res.locals.user;

    this.prisma.followers.findMany({
        where: {
            followingId: toFollow,
            followedById: user.id
        }
    }).then(result => {
        if (result.length == 0) {
            this.prisma.followers.create({
                data: {
                    following: {
                        connect: {
                            id: toFollow,
                        }
                    },
                    followedBy: {
                        connect: {
                            id: user.id,
                        }
                    }
                }
            }).then((result: any) => {
                return res.json(result);
            }).catch((error: any) => {
                res.status(500).json('Something went wrong');
            });
        } else {
            res.status(400).json('User already followed');
        }
    })
  }  
  
  public async unFollow(req: Request, res: Response) {
    const toUnFollow = req.body.user_id;
    const user = res.locals.user;

    const follower = this.prisma.followers.findFirst({
        where: {
            following: {
                id: toUnFollow
            },
            followedBy: {
                id: user.id
            }
        }
    }).then((result: any) => {
        return res.json(result);
    }).catch((error: any) => {
        res.status(500).json('Something went wrong');
    });
  }  

  public async followClub(req: Request, res: Response) {
    const toFollow = req.body.club_id;
    const user = res.locals.user;
    
    this.prisma.clubFollowers.findMany({
        where: {
            followingId: toFollow,
            followedById: user.id
        }
    }).then(result => {
        if (result.length == 0) {
            this.prisma.clubFollowers.create({
                data: {
                    following: {
                        connect: {
                            id: toFollow,
                        }
                    },
                    followedBy: {
                        connect: {
                            id: user.id,
                        }
                    }
                }
            }).then((result: any) => {
                return res.json(result);
            }).catch((error: any) => {
                res.status(500).json('Something went wrong');
            });
        } else {
            res.status(400).json('Club already followed');
        }
    })
}
  
  public async unFollowClub(req: Request, res: Response) {
    const toUnFollow = req.body.club_id;
    const user = res.locals.user;

    const follower = this.prisma.clubFollowers.findFirst({
        where: {
            following: {
                id: toUnFollow
            },
            followedBy: {
                id: user.id
            }
        }
    }).then((result: any) => {
        return res.json(result);
    }).catch((error: any) => {
        res.status(500).json('Something went wrong');
    });
  }  

  public async like(req: Request, res: Response) {
    const toLike = req.body.post_id;
    const user = res.locals.user;

    this.prisma.likes.findFirst({
        where: {
            post_id: parseInt(toLike),
            user_id: user.id
        }
    }).then((result) => {
        if (!result) {
            this.prisma.likes.create({
                data: {
                    post: {
                        connect: {
                            id: parseInt(toLike)
                        }
                    },
                    user:{
                        connect: {
                            id: user.id
                        }
                    }    
                }
            }).then((result: any) => {
                return res.json(result);
            }).catch((error: any) => {
                res.status(500).json('Something went wrong');
            });
        } else {
            res.status(401).json('Post already liked');
        }
    })
  }
  
  public async unLike(req: Request, res: Response) {
    const toUnLike = req.body.post_id;
    const user = res.locals.user;

    this.prisma.likes.deleteMany({
        where: {
            post_id: parseInt(toUnLike),
            user_id: user.id
        }
    }).then((result) => {
        res.json({result});
    }).catch(error => {
        res.status(401).json(error);
    })
  } 
  public async comment(req: Request, res: Response) {
    const toComment = req.body.post_id;
    const comment = req.body.comment;
    console.log(comment);
    const user = res.locals.user;
    this.prisma.comments.create({
        data: {
            content: comment,
            post: {
                connect: {
                    id: parseInt(toComment)
                }
            },
            user:{
                connect: {
                    id: user.id
                }
            }    
        }
    }).then((result: any) => {
        this.prisma.comments.findFirst({
            select: {
                id: true,
                content: true,
                post: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                    }
                }
            },
            where: {
                id: result.id
            }
        }).then(comment => {
            return res.json(comment);
        })
    }).catch((error: any) => {
        res.status(500).json('Something went wrong');
    });
  }

  public async inviteToClub(req: Request, res: Response) {
      const user = res.locals.user;
      const user_id = parseInt(req.body.user_id);
      const club_id = parseInt(req.body.club_id);
      const isAdmin = req.body.isadmin;
      // Check admin rights in the future
      const existingClub = this.prisma.clubMembers.findMany({
          where: {
              user_id: user_id,
              club_id: club_id
          }
      }).then(result => {
          if (result.length == 0) {
            this.prisma.clubMembers.create({
                data: {
                    user: {
                        connect: {
                            id: user_id
                        }
                    },
                    club: {
                        connect: {
                            id: club_id
                        }
                    },
                    isAdmin: false
                }
            }).then(result => {
                res.json(result);
            })
          } else {
              res.status(400).json('You are already member of the club');
          }
      })
  }

  public async changeRole(req: Request, res: Response) {
    const user = res.locals.user;
    const user_id = parseInt(req.body.user_id);
    const club_id = parseInt(req.body.club_id);
    const isAdmin = req.body.isadmin;
    this.prisma.clubMembers.findFirst({
        where: {
            user_id: user.id,
            isAdmin: true,
        }
    }).then(result => {
        if (result) {
            this.prisma.clubMembers.updateMany({
                where: {
                user_id: user_id,
                club_id: club_id
                },
                data: {
                isAdmin: isAdmin
                }
            })
            res.json({success: 'Successfully updated role'});
        }
    })
  }
}


export default ActionController;
