import { Response, Request, NextFunction } from "express";
import { PrismaClient } from '@prisma/client';
import Firebase from "../../controllers/firebaseController";

export default class NotificationMiddleware {

    public prisma: PrismaClient = new PrismaClient();
    private fbClient = new Firebase().client;

    followed(req: Request, res: Response, next: NextFunction) {
        const user = res.locals.user;
        const user_id: number = parseInt(req.body.user_id);

        const userObj = this.prisma.user.findUnique({
            select: {
                token: true
            },
            where: {
                id: user_id
            }
        }).then(result => {
            if (result?.token) {
                const message = {
                    notification: {
                        title: 'New Hiki activity',
                        body: 'You have a new follower!'
                    },
                    token: result.token
                }
                this.fbClient.messaging().send(message).then(result => {
                    console.log('Success');
                }).catch(error => {
                    console.log(error);
                })
            }
            const event = this.prisma.events.create({
                data: {
                    from: {
                        connect: {
                            id: user.id
                        }
                    },
                    to: {
                        connect: {
                            id: user_id
                        }
                    },
                    name: "Follow",
                    event: {
                        connect: {
                            eventName: 'Follow'
                        }
                    }
                }
            }).then(result => {
                next();
            })
        })

    }

    liked(req: Request, res: Response, next: NextFunction) {
        const user = res.locals.user;
        const post_id: number = parseInt(req.body.post_id);

        const post = this.prisma.post.findFirst({
            where: {
                id: post_id
            }
        }).then(post => {
            if (post) {
                const userObj = this.prisma.user.findUnique({
                    select: {
                        token: true
                    },
                    where: {
                        id: post.user_id
                    }
                }).then(result => {
                    console.log(result);
                    if (result?.token) {
                        const message = {
                            notification: {
                                title: 'New Hiki activity',
                                body: 'You received a new like!'
                            },
                            token: result.token
                        }
                        this.fbClient.messaging().send(message).then(result => {
                            console.log('Success');
                        }).catch(error => {
                            console.log(error);
                        })
                    }
                    const event = this.prisma.events.create({
                        data: {
                            from: {
                                connect: {
                                    id: user.id
                                }
                            },
                            to: {
                                connect: {
                                    id: post.user_id
                                }
                            },
                            name: "Like",
                            event: {
                                connect: {
                                    eventName: 'Like'
                                }
                            }
                        }
                    }).then(result => {
                        next();
                    })
                })
            }
        })
    }
}