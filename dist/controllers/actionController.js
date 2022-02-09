"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var awsController_1 = __importDefault(require("./awsController"));
var ActionController = /** @class */ (function () {
    function ActionController() {
        this.amazonWebServices = new awsController_1.default();
        this.prisma = new client_1.PrismaClient();
    }
    /**
     * @swagger
     * tags:
     *   name: Action routes
     *   description: For example, like, follow etc.
     */
    ActionController.prototype.follow = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var toFollow, user;
            var _this = this;
            return __generator(this, function (_a) {
                toFollow = req.body.user_id;
                user = res.locals.user;
                this.prisma.followers.findMany({
                    where: {
                        followingId: toFollow,
                        followedById: user.id
                    }
                }).then(function (result) {
                    if (result.length == 0) {
                        _this.prisma.followers.create({
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
                        }).then(function (result) {
                            return res.json(result);
                        }).catch(function (error) {
                            res.status(500).json('Something went wrong');
                        });
                    }
                    else {
                        res.status(400).json('User already followed');
                    }
                });
                return [2 /*return*/];
            });
        });
    };
    ActionController.prototype.unFollow = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var toUnFollow, user, follower;
            return __generator(this, function (_a) {
                toUnFollow = req.body.user_id;
                user = res.locals.user;
                follower = this.prisma.followers.findFirst({
                    where: {
                        following: {
                            id: toUnFollow
                        },
                        followedBy: {
                            id: user.id
                        }
                    }
                }).then(function (result) {
                    return res.json(result);
                }).catch(function (error) {
                    res.status(500).json('Something went wrong');
                });
                return [2 /*return*/];
            });
        });
    };
    ActionController.prototype.followClub = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var toFollow, user;
            var _this = this;
            return __generator(this, function (_a) {
                toFollow = req.body.club_id;
                user = res.locals.user;
                this.prisma.clubFollowers.findMany({
                    where: {
                        followingId: toFollow,
                        followedById: user.id
                    }
                }).then(function (result) {
                    if (result.length == 0) {
                        _this.prisma.clubFollowers.create({
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
                        }).then(function (result) {
                            return res.json(result);
                        }).catch(function (error) {
                            res.status(500).json('Something went wrong');
                        });
                    }
                    else {
                        res.status(400).json('Club already followed');
                    }
                });
                return [2 /*return*/];
            });
        });
    };
    ActionController.prototype.unFollowClub = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var toUnFollow, user, follower;
            return __generator(this, function (_a) {
                toUnFollow = req.body.club_id;
                user = res.locals.user;
                follower = this.prisma.clubFollowers.findFirst({
                    where: {
                        following: {
                            id: toUnFollow
                        },
                        followedBy: {
                            id: user.id
                        }
                    }
                }).then(function (result) {
                    return res.json(result);
                }).catch(function (error) {
                    res.status(500).json('Something went wrong');
                });
                return [2 /*return*/];
            });
        });
    };
    ActionController.prototype.like = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var toLike, user;
            var _this = this;
            return __generator(this, function (_a) {
                toLike = req.body.post_id;
                user = res.locals.user;
                this.prisma.likes.findFirst({
                    where: {
                        post_id: parseInt(toLike),
                        user_id: user.id
                    }
                }).then(function (result) {
                    if (!result) {
                        _this.prisma.likes.create({
                            data: {
                                post: {
                                    connect: {
                                        id: parseInt(toLike)
                                    }
                                },
                                user: {
                                    connect: {
                                        id: user.id
                                    }
                                }
                            }
                        }).then(function (result) {
                            return res.json(result);
                        }).catch(function (error) {
                            res.status(500).json('Something went wrong');
                        });
                    }
                    else {
                        res.status(401).json('Post already liked');
                    }
                });
                return [2 /*return*/];
            });
        });
    };
    ActionController.prototype.unLike = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var toUnLike, user;
            return __generator(this, function (_a) {
                toUnLike = req.body.post_id;
                user = res.locals.user;
                this.prisma.likes.deleteMany({
                    where: {
                        post_id: parseInt(toUnLike),
                        user_id: user.id
                    }
                }).then(function (result) {
                    res.json({ result: result });
                }).catch(function (error) {
                    res.status(401).json(error);
                });
                return [2 /*return*/];
            });
        });
    };
    ActionController.prototype.comment = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var toComment, comment, user;
            var _this = this;
            return __generator(this, function (_a) {
                toComment = req.body.post_id;
                comment = req.body.comment;
                console.log(comment);
                user = res.locals.user;
                this.prisma.comments.create({
                    data: {
                        content: comment,
                        post: {
                            connect: {
                                id: parseInt(toComment)
                            }
                        },
                        user: {
                            connect: {
                                id: user.id
                            }
                        }
                    }
                }).then(function (result) {
                    _this.prisma.comments.findFirst({
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
                    }).then(function (comment) {
                        return res.json(comment);
                    });
                }).catch(function (error) {
                    res.status(500).json('Something went wrong');
                });
                return [2 /*return*/];
            });
        });
    };
    ActionController.prototype.inviteToClub = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var user, user_id, club_id, isAdmin, existingClub;
            var _this = this;
            return __generator(this, function (_a) {
                user = res.locals.user;
                user_id = parseInt(req.body.user_id);
                club_id = parseInt(req.body.club_id);
                isAdmin = req.body.isadmin;
                existingClub = this.prisma.clubMembers.findMany({
                    where: {
                        user_id: user_id,
                        club_id: club_id
                    }
                }).then(function (result) {
                    if (result.length == 0) {
                        _this.prisma.clubMembers.create({
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
                        }).then(function (result) {
                            res.json(result);
                        });
                    }
                    else {
                        res.status(400).json('You are already member of the club');
                    }
                });
                return [2 /*return*/];
            });
        });
    };
    ActionController.prototype.changeRole = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var user, user_id, club_id, isAdmin;
            var _this = this;
            return __generator(this, function (_a) {
                user = res.locals.user;
                user_id = parseInt(req.body.user_id);
                club_id = parseInt(req.body.club_id);
                isAdmin = req.body.isadmin;
                this.prisma.clubMembers.findFirst({
                    where: {
                        user_id: user.id,
                        isAdmin: true,
                    }
                }).then(function (result) {
                    if (result) {
                        _this.prisma.clubMembers.updateMany({
                            where: {
                                user_id: user_id,
                                club_id: club_id
                            },
                            data: {
                                isAdmin: isAdmin
                            }
                        });
                        res.json({ success: 'Successfully updated role' });
                    }
                });
                return [2 /*return*/];
            });
        });
    };
    return ActionController;
}());
exports.default = ActionController;
