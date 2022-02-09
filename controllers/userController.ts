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

class UserController {

    public amazonWebServices = new AmazonWebServices();

    public prisma: PrismaClient = new PrismaClient();

    /**
     * @swagger
     * tags:
     *   name: Authentication
     *   description: User management
     */

    /**
       * @swagger
       * /register:
       *   post:
       *     description: Create new user and authenticate
       *     tags: [Authentication]
       *     produces:
       *       - application/json
       *     parameters:
       *       - name: email
       *         description: User's email.
       *         required: true
       *         type: string
       *       - name: username
       *         description: User's password.
       *         required: true
       *         type: string
       *     responses:
       *       200:
       *         description: Returns user object with token
       *         schema:
       *           type: object
       *           properties:
       *            id:
       *              type: integer
       *              description: The user ID.
       *            username:
       *              type: string
       *              description: The user name.
       */
    // public async registerUser(req: Request, res: Response): Promise<void> {

    // 	const userData = JSON.parse(req.body.user);
    // 	const user: IUser = {
    // 		email: userData.email,
    // 		name: userData.name,
    // 		username: userData.username,
    // 		token: userData.token
    // 	};

    // 	const hashedPassword = bcrypt.hashSync(userData.password, bcrypt.genSaltSync(10));
    // 	const existingUser = await this.findUserByEmail(user.email);

    // 	if (existingUser) {
    // 		res.status(400).json({ error: 'User already exists' });
    // 	} else {
    // 		if (req.file !== null) {
    // 			const extension = req.file.mimetype.split('/')[1];
    // 			const key = `${req.file.originalname}`;
    // 			this.mediaKeyEntry(req.file.originalname, key, `${process.env.DO_SPACES_CDN}/${key}`).then(async (result: any) => {
    // 				return this.createUser(user, hashedPassword, result);
    // 			}).then((user: any) => {
    // 				console.log(user);
    // 				return this.authenticate(userData.email, userData.password);
    // 			}).then(response => {
    // 				console.log(response);
    // 				res.status(200).json(response);
    // 			}).catch((error) => {
    // 				console.log(error);
    // 				res.status(500).json('Something went wrong');
    // 			});
    // 		} else {
    // 			this.createUserWithoutPicture(user, hashedPassword).then((user: any) => {
    // 				return this.authenticate(userData.email, userData.password);
    // 			}).then(response => {
    // 				res.status(200).json(response);
    // 			}).catch((error) => {
    // 				console.log(error);
    // 				res.status(500).json('Something went wrong');
    // 			});
    // 		}
    // 	}
    // }

    private async createUser(user: any, hashedPassword: string, media: any) {
        return new Promise(async (resolve, reject) => {
            await this.prisma.user.create({
                data: {
                    name: user.name,
                    email: user.email,
                    username: user.username,
                    password: hashedPassword,
                    token: user.token,
                    profile: {
                        create: {
                            description: '',
                            media: {
                                connect: {
                                    id: media.id
                                }
                            }
                        }
                    }
                },
            }).then(user => {
                resolve(user);
            }).catch(error => {
                reject(error);
            })
        });
    }

    private async createUserWithoutPicture(user: any, hashedPassword: string) {
        return new Promise(async (resolve, reject) => {
            await this.prisma.user.create({
                data: {
                    name: user.name,
                    email: user.email,
                    username: user.username,
                    password: hashedPassword,
                    token: user.token,
                    profile: {
                        create: {
                            description: '',
                            media: {
                                connect: undefined
                            }
                        }
                    }
                },
            }).then(user => {
                resolve(user);
            }).catch(error => {
                reject(error);
            });
        });
    }

    public async authenticateUser(req: Request, res: Response) {
        // const user = {
        // 	email: req.body.email,
        // 	password: req.body.password,
        // };
        if (!req.body.mobile) return res.status(422).send('invalid mobile');

        this.authenticateByNumber(req.body).then(result => {
            res.status(200).json(result);
        }).catch(error => {
            res.status(400).json({ message: 'Wrong username or password' });
        });
    }

    async authenticateByNumber(body: any) {
        let response: any;
        let mobile = body.mobile;
        const expiresIn = parseInt(process.env.TOKEN_EXPIRES!, 10);
        return await new Promise((resolve, reject) => {
            this.findUserByMobile(mobile).then(async (result) => {
                let user: any = result;
                if (!user) {
                    const userC = await this.prisma.user.create({
                        data: {
                            mobile: mobile,
                            firebaseId: body.firebaseId || null,
                        }
                    });
                    user = await this.findUserByMobile(userC.mobile);
                    // console.log('>> User: ', user);
                }
                // console.log('>> User: ', user);
                const token = jwt.sign({ mobile }, config.JWT_SECRET, {
                    expiresIn: expiresIn,
                });
                const currentTime = moment().tz('Europe/Helsinki');
                const expiresAt = currentTime.add(expiresIn, "seconds").format("YYYY-MM-DD HH:mm:ss");
                let isProfileCompleted = false;
                if (user.name && user.age && user.profile.media.id) {
                    isProfileCompleted = true;
                }
                response = { user_id: user.id, name: user.name, age: user.age, email: user.email, mobile: mobile, username: user.username, firebaseId: user.firebaseId, ...{ token }, expires: expiresAt.toString(), isProfileCompleted: isProfileCompleted };
                resolve(response);
            });
        });
    }

    /**
     * @swagger
     * /auth/login:
     *   post:
     *     description: Authenticate a user
     *     responses:
     *       200:
     *         description: Returns a mysterious string.
     */

    // async authenticate(email: string, password: string) {
    // 	let response: any;
    // 	const expiresIn = parseInt(process.env.TOKEN_EXPIRES!, 10);
    // 	return await new Promise((resolve, reject) => {
    // 		this.findUserByEmail(email).then(async (result) => {
    // 			if (result) {
    // 				const isCorrectPassword = bcrypt.compareSync(password, result?.password);
    // 				if (isCorrectPassword === true) {
    // 					const email = result?.email;
    // 					const token = jwt.sign({ email }, config.JWT_SECRET, {
    // 						expiresIn: expiresIn,
    // 					});
    // 					const currentTime = moment().tz('Europe/Helsinki');
    // 					const expiresAt = currentTime.add(expiresIn, "seconds").format("YYYY-MM-DD HH:mm:ss");
    // 					response = { user_id: result.id, email: email, username: result.username, ...{ token }, expires: expiresAt.toString() };
    // 					resolve(response);
    // 				} else {
    // 					reject("Wrong password");
    // 				}
    // 			} else {
    // 				reject("Wrong username or password");
    // 			}
    // 		});
    // 	});
    // }

    public async getUser(req: Request, res: Response) {
        console.log(res.locals.user);

        const user = await this.prisma.user.findFirst({
            select: {
                id: true,
                name: true,
                mobile: true,
                email: true,
                username: true,
                firebaseId: true,
                age: true,
                createdAt: true,
                updatedAt: true,
                deleted: true,
                profile: {
                    select: {
                        description: true,
                        media: true,
                    }
                },
            },
            where: { id: res.locals.user.id }
        });

        return res.status(200).json(user);
    }

    /**
     * Find user by mobile
     * @param mobile: User's mobile
     */
    public async findUserByMobile(mobile: any) {

        const user = await this.prisma.user.findUnique({
            select: {
                id: true,
                name: true,
                mobile: true,
                email: true,
                username: true,
                firebaseId: true,
                age: true,
                createdAt: true,
                updatedAt: true,
                deleted: true,
                profile: {
                    select: {
                        description: true,
                        media: true,
                    }
                },
            },
            where: { mobile: mobile + '' },
        });
        return user || false;
    }

    /**
     * Find user by email
     * @param userEmail: User's email
     */
    public async findUserByEmail(userEmail: string) {
        console.log(userEmail);
        const user = await this.prisma.user.findUnique({
            select: {
                id: true, name: true, email: true, username: true, password: true,
            },
            where: { email: userEmail },
        });
        return user || false;
    }

    public async getUserProfile(req: Request, res: Response) {
        const loggedUser = res.locals.user;
        let user_id = parseInt(req.params.id!);
        const [user, followersCount, followingCount, followers, following, memberOf] = await this.prisma.$transaction([
            this.prisma.user.findFirst({
                select: {
                    id: true, name: true, email: true, username: true,
                    profile: {
                        select: {
                            description: true,
                            media: true,
                        }
                    },
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
                where: { id: user_id ? user_id : loggedUser.id }
            }),
            this.prisma.followers.aggregate({
                where: {
                    followedById: user_id ? user_id : loggedUser.id
                },
                count: true,
            }),
            this.prisma.user.findFirst({
                select: {
                    _count: {
                        select: { following: true, clubFollowing: true },
                    },
                },
                where: {
                    id: user_id ? user_id : loggedUser.id
                },
            }),

            this.prisma.followers.findMany({
                where: {
                    followedById: user_id ? user_id : loggedUser.id
                },
                select: {
                    following: {
                        select: {
                            id: true,
                            name: true, email: true, username: true,
                            profile: {
                                select: {
                                    description: true,
                                    media: true,
                                }
                            },
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
                    }
                }
            }),
            this.prisma.followers.findMany({
                where: {
                    followingId: user_id ? user_id : loggedUser.id
                },
                select: {
                    following: {
                        select: {
                            id: true, name: true, email: true, username: true,
                            profile: {
                                select: {
                                    description: true,
                                    media: true,
                                }
                            },
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
                    }
                }
            }),
            this.prisma.clubMembers.findMany({
                where: {
                    user_id: user_id ? user_id : loggedUser.id
                },
                select: {
                    club: {
                        select: {
                            id: true, name: true, description: true,
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
                        }
                    }
                },
            })
        ]);

        if (user) {
            return res.json({ owner: user_id == loggedUser.id ? true : false, user: user, followersCount: followersCount, followingCount: followingCount!._count!.following + followingCount!._count!.clubFollowing, followers: followers, following: following, memberOf: memberOf });
        } else {
            res.status(500);
        }
    }

    public async updateProfile(req: Request, res: Response) {
        const user = res.locals.user;
        const { name, description = null, age = null } = req.body;
        let userData = req.body;

        if (!userData.name) return res.status(422).send('invalid username');

        let profile = await this.prisma.profile.findFirst({
            where: {
                user_id: user.id
            }
        });
        if (!profile) {
            await this.prisma.profile.create({
                data: {
                    user_id: user.id
                }
            });
        }

        if (req.file) {
            const extension = req.file.mimetype.split('/')[1];
            const key = `${req.file.originalname}`;
            this.mediaKeyEntry(req.file.originalname, key, `${process.env.DO_SPACES_CDN}/${key}`).then(async (result: any) => {
                return this.updateUserProfile(user, userData, result);
            }).then((user: any) => {
                res.json('Success');
            }).catch((error) => {
                console.log(error);
                res.status(500).json('Something went wrong');
            });
        } else {
            this.updateUserProfileWithoutPicture(user, userData).then((user: any) => {
                res.status(200).json('Success');
            }).catch((error: any) => {
                console.log(error);
                res.status(500).json('Something went wrongs' + error);
            });
        }
    }

    private async updateUserProfile(user: any, userData: any, media: any) {
        return new Promise(async (resolve, reject) => {
            await this.prisma.user.update({
                data: {
                    name: userData.name,
                    age: parseInt(userData.age) || null,
                    profile: {
                        update: {
                            description: userData.description || '',
                            media: {
                                connect: {
                                    id: media.id
                                }
                            }
                        }
                    }
                },
                where: {
                    id: user.id
                }
            }).then(user => {
                resolve(user);
            }).catch(error => {
                reject(error);
            })
        });
    }

    private async updateUserProfileWithoutPicture(user: any, userData: any) {
        return new Promise(async (resolve, reject) => {
            let obj = {};
            if (userData.name) {
                Object.assign(obj, { name: userData.name });
            }
            if (userData.age) {
                Object.assign(obj, { age: parseInt(userData.age) || null });
            }
            if (userData.description) {
                Object.assign(obj, { profile: { update: { description: userData.description } } });
            }
            await this.prisma.user.update({
                data: obj,
                where: {
                    id: user.id
                }
            }).then(user => {
                resolve(user);
            }).catch(error => {
                reject(error);
            })
        });
    }

    public async getUsersList(req: Request, res: Response) {
        const user = res.locals.user;
        const tag = parseInt(req.query.tag!.toString());

        if (tag) {
            const users = await this.prisma.userHasTags.findMany({
                take: 10,
                where: {
                    tagId: tag
                },
                select: {
                    user: {
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
                        },
                    }
                }
            }).then(result => {
                res.json(result);
            })
        } else {
            const users = await this.prisma.user.findMany({
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
                },
            }).then(result => {
                res.json(result);
            })
        }
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
    /*async uploadS3(req: Request, res: Response, id: string) {
      let key: string;
      console.log(req);
      return new Promise((resolve, reject) => {
        console.log(req.file);
        
        uploadS3(req, res, (error: any) => {
          if (error) {
            console.log(error);
            reject(error);
          } else {
            resolve(key);
          }
        });
      });
    }*/

    public async getNotifications(req: Request, res: Response) {
        const user = res.locals.user;
        this.prisma.events.findMany({
            where: {
                eventToId: user.id
            },
            select: {
                event: true,
                name: true,
                from: {
                    select: {
                        id: true,
                        username: true,
                        name: true,
                        profile: {
                            select: {
                                description: true,
                                media: true
                            }
                        }
                    }
                }
            }
        }).then(result => {
            res.json(result);
        })
    }

    public async addContactList(req: Request, res: Response) {
        const user = res.locals.user;
        let requestContact = req.body;
        requestContact = requestContact.map((obj: any) => {
            obj.user_id = user.id;
            obj.mobile = obj.mobile.replace(/\s/g, '').replace(/[-()+]/g, '');
            return obj;
        });
        await this.prisma.contactList.deleteMany({ where: { user_id: user.id } });

        this.prisma.contactList.createMany({
            data: requestContact,
        }).then((result: any) => {
            return res.send('Inserted successfully!');
        }).catch((error: any) => {
            res.status(500).json('Something went wrong');
        });
    }

    public async getContactList(req: Request, res: Response) {
        const user = res.locals.user;

        this.prisma.contactList.findMany({
            where: { user_id: user.id },
        }).then(async (result: any) => {
            let cntRes = await this.processContactList(result, user);

            return res.json(cntRes);
        }).catch((error: any) => {
            res.status(500).json('Something went wrong');
        });
    }

    private async processContactList(result: any, user: any) {
        if (result) {
            await Promise.all(
                result.map(async (val: any) => {
                    let isUserAvailable = await this.prisma.user.count({
                        where: {
                            mobile: val.mobile,
                        }
                    });
                    if (isUserAvailable) {
                        val.isUserAlreadyExist = true;
                    } else {
                        val.isUserAlreadyExist = false;
                    }

                    if (isUserAvailable) {
                        let follow = await this.prisma.followers.count({
                            where: {
                                followingId: val.id,
                                followedById: user.id,
                            }
                        });
                        if (follow) {
                            val.follow = true;
                        } else {
                            val.follow = false;
                        }
                    } else {
                        val.follow = false;
                    }

                    return val;
                })
            );

            let resData = {
                newUser: [] as any,
                existingUser: [] as any,
            };

            result.forEach((element: any) => {
                if (!element.isUserAlreadyExist) {
                    resData.newUser.push(element);
                } else {
                    resData.existingUser.push(element);
                }
            });

            return resData;
        }
        return [];
    }
}


export default UserController;
