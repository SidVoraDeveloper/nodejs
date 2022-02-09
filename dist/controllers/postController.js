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
var multer_1 = __importDefault(require("multer"));
var multer_s3_1 = __importDefault(require("multer-s3"));
var awsController_1 = __importDefault(require("./awsController"));
var client_1 = require("@prisma/client");
var PostController = /** @class */ (function () {
    function PostController() {
        this.amazonWebServices = new awsController_1.default();
        this.prisma = new client_1.PrismaClient();
        this.fileSizeLimit = 100000000;
        this.uploadPost = (0, multer_1.default)({
            storage: (0, multer_s3_1.default)({
                s3: awsController_1.default.s3,
                bucket: awsController_1.default.bucketParams.Bucket,
                acl: 'public-read',
                key: function (request, file, cb) {
                    var extension = file.mimetype.split('/')[1];
                    console.log(extension);
                    var key = "" + file.originalname;
                    cb(null, key);
                },
            }),
            limits: { fileSize: 1000000 },
        }).single('file');
    }
    /**
     * @swagger
     * tags:
     *   name: Post routes
     *   description: Posts
     */
    PostController.prototype.getPostsAWS = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Call S3 to obtain a list of the objects in the bucket
                awsController_1.default.s3.listObjects(awsController_1.default.bucketParams, function (err, data) {
                    if (err) {
                        console.log("Error", err);
                        res.status(500).send({ message: "Error" });
                    }
                    else {
                        console.log("Success", data);
                        res.json(data);
                    }
                });
                return [2 /*return*/];
            });
        });
    };
    PostController.prototype.getUserPosts = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var post_id, user;
            return __generator(this, function (_a) {
                post_id = parseInt(req.query.post.toString());
                user = res.locals.user;
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
                }).then(function (posts) {
                    res.status(200).json(posts);
                });
                return [2 /*return*/];
            });
        });
    };
    PostController.prototype.getPosts = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var page, loggedUser, take, skip;
            var _this = this;
            return __generator(this, function (_a) {
                page = 0;
                if (req.query.page) {
                    console.log(req.query.page);
                    page = parseInt(req.query.page.toString());
                    console.log(page);
                }
                loggedUser = res.locals.user;
                take = 10;
                skip = take * page;
                this.prisma.followers.findMany({
                    select: {
                        followingId: true
                    },
                    where: {
                        followedBy: loggedUser
                    }
                }).then(function (following) {
                    var followers = following.map(function (follower) {
                        return follower.followingId;
                    });
                    followers.push(loggedUser.id);
                    _this.prisma.clubFollowers.findMany({
                        select: {
                            followingId: true
                        },
                        where: {
                            followedBy: loggedUser
                        }
                    }).then(function (clubFollowing) {
                        var clubs = clubFollowing.map(function (follower) {
                            return follower.followingId;
                        });
                        _this.prisma.post.findMany({
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
                                club_id: true,
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
                        }).then(function (posts) {
                            res.status(200).json(posts);
                        });
                    });
                });
                return [2 /*return*/];
            });
        });
    };
    PostController.prototype.upload = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var user, post, userObj, files, postFile, thumbnail;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = res.locals.user;
                        post = JSON.parse(req.body.post);
                        return [4 /*yield*/, this.prisma.user.findUnique({
                                where: {
                                    id: user.id,
                                },
                            })];
                    case 1:
                        userObj = _a.sent();
                        files = Object.assign(req.files);
                        postFile = {
                            originalname: files[0].originalname,
                            extension: files[0].mimetype.split('/')[1],
                            key: "" + files[0].originalname,
                        };
                        thumbnail = null;
                        if (files[1]) {
                            thumbnail = {
                                originalname: files[1].originalname,
                                extension: files[1].mimetype.split('/')[1],
                                key: "" + files[1].originalname,
                            };
                        }
                        this.mediaKeyEntry(postFile).then(function (result) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, this.createPost(postFile.key, userObj, post, thumbnail)];
                            });
                        }); }).then(function () {
                            res.status(201).json("Success!");
                        }).catch(function (error) {
                            console.log(error);
                            res.status(500).json('Something went wrong');
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    PostController.prototype.mediaKeyEntry = function (postFile) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            this.prisma.media.create({
                                data: {
                                    key: postFile.key,
                                    name: postFile.originalname,
                                    url: process.env.DO_SPACES_CDN + "/" + postFile.key,
                                }
                            }).then(function (result) {
                                resolve(result);
                            }).catch(function (error) {
                                reject(error);
                            });
                            return [2 /*return*/];
                        });
                    }); })];
            });
        });
    };
    /**
     *
     */
    PostController.prototype.createPost = function (id, user, post, thumbnail) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var data, data;
                        return __generator(this, function (_a) {
                            if (thumbnail) {
                                data = {};
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
                                            url: process.env.DO_SPACES_CDN + "/" + thumbnail.key,
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
                                    data: data
                                }).then(function (post) {
                                    resolve(post);
                                }).catch(function (error) {
                                    reject(error);
                                });
                            }
                            else {
                                data = {};
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
                                    };
                                }
                                this.prisma.post.create({
                                    data: data
                                }).then(function (post) {
                                    resolve(post);
                                }).catch(function (error) {
                                    reject(error);
                                });
                            }
                            return [2 /*return*/];
                        });
                    }); })];
            });
        });
    };
    return PostController;
}());
exports.default = PostController;
