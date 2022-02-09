import { Request, Response } from 'express';
import multer from 'multer';
import multerS3 from 'multer-s3';
import AmazonWebServices from './awsController';
import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from '@prisma/client';

class PostController {

  public amazonWebServices = new AmazonWebServices();

  public prisma: PrismaClient = new PrismaClient();

  public fileSizeLimit = 100000000;

  /**
   * @swagger
   * tags:
   *   name: Post routes
   *   description: Posts
   */
  
  public async getPostsAWS(req: Request, res: Response) {

    // Call S3 to obtain a list of the objects in the bucket
    AmazonWebServices.s3.listObjects(AmazonWebServices.bucketParams, function(err, data) {
      if (err) {
        console.log("Error", err);
        res.status(500). send({message: "Error"});
      } else {
        console.log("Success", data);
        res.json(data);
      }
    });
  }

  public async getUserPosts(req: Request, res: Response) {

    const post_id = parseInt(req.query.post!.toString());
    const user = res.locals.user;

    this.prisma.post.findMany({
      where: {
        id: post_id,
      },
      orderBy: {
        createdAt: "desc"
      },
      select: {
        id: true,
        description: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            profile: {
              select: {
                media: true
              }
            }
          }
        },
        comments: {
          select: {
            id: true,
            user: true,
            content: true
          }
        },
        thumbnail: true,
        media: true,
        likes: {
          where: {
            user_id: user.id,
          },
        },
        _count: {
          select: {
            likes: true,
          }
        }
      }
    }).then((posts: any) => {
      res.status(200).json(posts);
    });
  }

  public async getPosts(req: Request, res: Response) {
    let page = 0;
    if (req.query.page) {
      console.log(req.query.page);
      page = parseInt(req.query.page.toString());
      console.log(page);
    }
    const loggedUser = res.locals.user;
    let take = 10;
    let skip = take * page;

    this.prisma.followers.findMany({
      select: {
        followingId: true
      },
      where: {
        followedBy: loggedUser
      }
    }).then(following => {
      const followers = following.map(follower => {
        return follower.followingId;
      });
      followers.push(loggedUser.id);

      this.prisma.clubFollowers.findMany({
        select: {
          followingId: true
        },
        where: {
          followedBy: loggedUser
        }
      }).then(clubFollowing => {
        const clubs = clubFollowing.map(follower => {
          return follower.followingId;
        })
        this.prisma.post.findMany({ 
          where: {
            OR: [
              {
                user_id: {
                  in: followers
                }
              },
              {
                club_id: {
                  in: clubs
                }
              }
            ]
          },
          skip: skip,
          take: take,
          orderBy: {
            createdAt: "desc"
          },
          select: {
            id: true,
            createdAt: true,
            description: true,
            user_id: true,
            club_id:true,
            club: {
              select: {
                name: true,
                media: true,
              }
            },
            user: {
              select: {
                name: true,
                username: true,
                profile: {
                  select: {
                    media: true
                  }
                }
              }
            },
            comments: {
              select: {
                id: true,
                user: true,
                content: true
              }
            },
            thumbnail: true,
            media: true,
            likes: {
              where: {
                user_id: loggedUser.id,
              },
            },
            _count: {
              select: {
                likes: true,
              }
            }
          },
        }).then((posts: any) => {
          res.status(200).json(posts);
        });
      })
    })

  }

  public async upload(req: Request, res: Response) {
    const user = res.locals.user;
    let post = JSON.parse(req.body.post);
    const userObj = await this.prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });
    let files = Object.assign(req.files)
    const postFile = {
      originalname: files[0].originalname,
      extension: files[0].mimetype.split('/')[1],
      key: `${files[0].originalname}`,
    };

    let thumbnail: any = null;
    if (files[1]) {
      thumbnail = {
        originalname: files[1].originalname,
        extension: files[1].mimetype.split('/')[1],
        key: `${files[1].originalname}`,
      }
    }
   
    this.mediaKeyEntry(postFile).then(async(result) => {
      return this.createPost(postFile.key, userObj, post, thumbnail);
    }).then(() => {
      res.status(201).json("Success!");
    }).catch((error) => {
      console.log(error);
      res.status(500).json('Something went wrong');
    });
  }

  uploadPost = multer({
    storage: multerS3({
      s3: AmazonWebServices.s3,
      bucket: AmazonWebServices.bucketParams.Bucket,
      acl: 'public-read',
      key: function (request: any, file: any, cb: any) {
        const extension = file.mimetype.split('/')[1];
        console.log(extension);
        const key = `${file.originalname}`;
        cb(null, key);
      },
    }),
    limits: { fileSize: 1000000 },
  }).single('file');

  public async mediaKeyEntry(postFile: any) {
    return new Promise(async (resolve, reject) => {
        this.prisma.media.create({
          data: {
            key: postFile.key,
            name: postFile.originalname,
            url: `${process.env.DO_SPACES_CDN}/${postFile.key}`,
          }
        }).then((result: any) => {
          resolve(result);
        }).catch((error: any) => {
          reject(error);
        });     
    });
  }
  
  /**
   * 
   */
  async createPost(id: string, user: any, post: any, thumbnail: any) {
    return new Promise(async (resolve, reject) => {
      if (thumbnail) {
        let data: any = {};
        data = {
          description: post.post ? post.post : '',
          user: {
            connect: {
              id: user.id
            }
          },
          media: {
            connect: {
              key: id
            }
          },
          thumbnail: {
            create: {
              key: thumbnail.key,
              name: thumbnail.originalname,
              url: `${process.env.DO_SPACES_CDN}/${thumbnail.key}`, 
            }
          }
        };
        if (post.club) {
          data.club = {
            connect: {
              id: post.club
            }
          };
        }
        this.prisma.post.create({
          data
        }).then((post: any) => {
          resolve(post);
        }).catch((error: any) => {
          reject(error);
        });
      } else {
        let data: any = {};
        data = {
          description: post.post ? post.post : '',
          user: {
            connect: {
              id: user.id
            }
          },
          media: {
            connect: {
              key: id
            }
          },
        };
        if (post.club) {
          console.log(post);
          data.club = {
              connect: {
                id: post.club
              }
          }
        }
        this.prisma.post.create({
         data
        }).then((post: any) => {
          resolve(post);
        }).catch((error: any) => {
          reject(error);
        });
      }
    })
  } 
}

export default PostController;
