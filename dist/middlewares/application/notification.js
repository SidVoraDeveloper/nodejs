"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var firebaseController_1 = __importDefault(require("../../controllers/firebaseController"));
var NotificationMiddleware = /** @class */ (function () {
    function NotificationMiddleware() {
        this.prisma = new client_1.PrismaClient();
        this.fbClient = new firebaseController_1.default().client;
    }
    NotificationMiddleware.prototype.followed = function (req, res, next) {
        var _this = this;
        var user = res.locals.user;
        var user_id = parseInt(req.body.user_id);
        var userObj = this.prisma.user.findUnique({
            select: {
                token: true
            },
            where: {
                id: user_id
            }
        }).then(function (result) {
            if (result === null || result === void 0 ? void 0 : result.token) {
                var message = {
                    notification: {
                        title: 'New Hiki activity',
                        body: 'You have a new follower!'
                    },
                    token: result.token
                };
                _this.fbClient.messaging().send(message).then(function (result) {
                    console.log('Success');
                }).catch(function (error) {
                    console.log(error);
                });
            }
            var event = _this.prisma.events.create({
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
            }).then(function (result) {
                next();
            });
        });
    };
    NotificationMiddleware.prototype.liked = function (req, res, next) {
        var _this = this;
        var user = res.locals.user;
        var post_id = parseInt(req.body.post_id);
        var post = this.prisma.post.findFirst({
            where: {
                id: post_id
            }
        }).then(function (post) {
            if (post) {
                var userObj = _this.prisma.user.findUnique({
                    select: {
                        token: true
                    },
                    where: {
                        id: post.user_id
                    }
                }).then(function (result) {
                    console.log(result);
                    if (result === null || result === void 0 ? void 0 : result.token) {
                        var message = {
                            notification: {
                                title: 'New Hiki activity',
                                body: 'You received a new like!'
                            },
                            token: result.token
                        };
                        _this.fbClient.messaging().send(message).then(function (result) {
                            console.log('Success');
                        }).catch(function (error) {
                            console.log(error);
                        });
                    }
                    var event = _this.prisma.events.create({
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
                    }).then(function (result) {
                        next();
                    });
                });
            }
        });
    };
    return NotificationMiddleware;
}());
exports.default = NotificationMiddleware;
