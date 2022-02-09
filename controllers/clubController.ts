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

class ClubController {

  public amazonWebServices = new AmazonWebServices();

  public prisma: PrismaClient = new PrismaClient();

  public async registerClub(req: Request, res: Response): Promise<void> {

    const user = res.locals.user;

    const clubData = JSON.parse(req.body.club);
    const club = {
      name: clubData.name,
      description: clubData.description,
      sport: clubData.sport,
      isPrivate: clubData.isprivate,
      isClosed: clubData.isClosed
    };
    if (req.file) {
      const extension = req.file.mimetype.split('/')[1];
      const key = `${req.file.originalname}`;
      this.mediaKeyEntry(req.file.originalname, key, `${process.env.DO_SPACES_CDN}/${key}`).then(async (result: any) => {
        return this.createClub(user, club, result);
      }).then(response => {
        res.status(200).json(response);
      }).catch((error) => {
        console.log(error);
        res.status(500).json('Something went wrong');
      });
    }
  }

  public async createClub(user: any, club: any, media: any) {
    return new Promise(async (resolve, reject) => {
      await this.prisma.clubs.create({
        data: {
          name: club.name,
          description: club.description,
          media: {
            connect: {
              id: media.id
            }
          },
          isPrivate: club.isPrivate,
          isClosed: club.isClosed,
          clubMembers: {
            create: [
              { 
                user: {
                  connect: {
                    id: user.id
                  }
                },
                isAdmin: true,
              },
            ]
          },
          clubHasTags: {
            create: [
              {
                tag: {
                  connect: {
                    id: club.sport,
                  }
                }
              }
            ]
          }
        },
      }).then(user => {
        resolve(user);
      }).catch(error => {
        reject(error);
      })
    });
  }

  public async getClubsList(req: Request, res: Response) {
    const user = res.locals.user;
    const tag = parseInt(req.query.tag!.toString());
    if (tag) {
      const clubsWithTag = await this.prisma.clubHasTags.findMany({
        take: 10,
        where: {
          tagId: tag
        },
        select: {
          club: {
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
            },
          },
        }
      }).then(result => {
        return res.json({ clubs: result});
      })
    } else {
      const clubsWithTag = await this.prisma.clubHasTags.findMany({
        take: 10,
        select: {
          club: {
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
          }
        }
      }).then(result => {
        return res.json({ clubs: result});
      })
    }

  }

  public async getUserClubs(req: Request, res: Response) {
    const user = res.locals.user;
    const clubs = await this.prisma.clubMembers.findMany({
      where: {
        user_id: user.id,
      },
      select: {
        isAdmin: true,
        club: {
          select: {
            id: true,
            name: true,
            description: true,
            media: true,
          }
        }
      }
    }).then((result: any) => {
      return res.json({clubs: result});
    });
  }

  public async getClubProfile(req: Request, res: Response) {
    const loggedUser = res.locals.user;
    let club_id = parseInt(req.params.id!);
    const club = await this.prisma.clubs.findFirst({
      select: {
        name: true, description: true,
        media: true,
        posts: {
          select: {
            id: true,
            thumbnail: true,
            media: true,
          },
          orderBy: {
            createdAt: 'desc',
          }
        },
      },
      where: { id: club_id }
    });
    const followers = await this.prisma.clubFollowers.aggregate({
      where: {
        following: {
          id: club_id
        }
      },
      count: true,
    });

    const members = await this.prisma.clubMembers.findMany({
      where: {
        club_id: club_id
      },
      select: {
        user: {
          select: {
            id: true,
            name: true,
            profile: {
              select: {
                media: true
              }
            },
            username: true,
            email: true,
          }
        },
        isAdmin: true,
      }
    })

    if (club) {
      return res.json({ club: club, followers: followers, members: members });
    } else {
      res.status(500);
    }
  }

  public async updateProfile(req: Request, res: Response) {
    const user = res.locals.user;
    const { name, description, is_private, is_closed } = req.body;
    const club_id = parseInt(req.params.id!);
    const clubData = {
      name: name,
      description: description,
      is_private: is_private,
      is_closed: is_closed
    }
    const club = this.prisma.clubMembers.findFirst({
      where: {
        isAdmin: true,
        club_id: club_id,
        user_id: user.id
      }
    }).then(result => {
      if (result) {
        if (req.file !== null) {
          const extension = req.file.mimetype.split('/')[1];
          const key = `${req.file.originalname}`;
          this.mediaKeyEntry(req.file.originalname, key, `${process.env.DO_SPACES_CDN}/${key}`).then(async (result: any) => {
            return this.updateClubProfile(club_id, clubData, result);
          }).then((user: any) => {
            res.json('Success');
          }).catch((error) => {
            console.log(error);
            res.status(500).json('Something went wrong');
          });
        } else {
          this.updateClubProfileWithoutPicture(club_id, clubData).then((user: any) => {
            res.status(200).json('Success');
          }).catch((error: any) => {
            console.log(error);
            res.status(500).json('Something went wrong');
          });
        }
      } else {
        res.status(402).json('Unauthorised to edit club');
      }
    })
  }

  private async updateClubProfile(club_id: any, clubData: any, media: any) {
    return new Promise(async (resolve, reject) => {
      await this.prisma.clubs.update({
        data: {
          name: clubData.name,
          description: clubData.description,
          isClosed: clubData.is_closed,
          isPrivate: clubData.is_private,
          media: {
            connect: {
              id: media.id
            }
          }
        },
        where: {
          id: club_id
        }
      }).then(club => {
        resolve(club);
      }).catch(error => {
        reject(error);
      })
    });
  }

  private async updateClubProfileWithoutPicture(club_id: any, clubData: any) {
    return new Promise(async (resolve, reject) => {
      await this.prisma.clubs.update({
        data: {
          name: clubData.name,
          description: clubData.description,
          isClosed: clubData.is_closed,
          isPrivate: clubData.is_private,
        },
        where: {
          id: club_id
        }
      }).then(club => {
        resolve(club);
      }).catch(error => {
        reject(error);
      })
    });
  }
  
  public async mediaKeyEntry(id: string, name: string, url: string) {
    return new Promise(async (resolve, reject) => {
      this.prisma.media.create({
        data: {
          key: id,
          name: name,
          url: url
        }
      }).then((result: any) => {
        resolve(result);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }
}


export default ClubController;
