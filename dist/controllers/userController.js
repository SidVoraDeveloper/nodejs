"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
// import passport from 'passport';
// import LocalStrategy from 'passport-local';
var jwt = __importStar(require("jsonwebtoken"));
var config_1 = __importDefault(require("../configs/config"));
var moment_timezone_1 = __importDefault(require("moment-timezone"));
var awsController_1 = __importDefault(require("./awsController"));
var fileSizeLimit = 100000000;
var UserController = /** @class */ (function () {
    function UserController() {
        this.amazonWebServices = new awsController_1.default();
        this.prisma = new client_1.PrismaClient();
    }
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
    UserController.prototype.createUser = function (user, hashedPassword, media) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.prisma.user.create({
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
                                    }).then(function (user) {
                                        resolve(user);
                                    }).catch(function (error) {
                                        reject(error);
                                    })];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    UserController.prototype.createUserWithoutPicture = function (user, hashedPassword) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.prisma.user.create({
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
                                    }).then(function (user) {
                                        resolve(user);
                                    }).catch(function (error) {
                                        reject(error);
                                    })];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    UserController.prototype.authenticateUser = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // const user = {
                // 	email: req.body.email,
                // 	password: req.body.password,
                // };
                if (!req.body.mobile)
                    return [2 /*return*/, res.status(422).send('invalid mobile')];
                this.authenticateByNumber(req.body).then(function (result) {
                    res.status(200).json(result);
                }).catch(function (error) {
                    res.status(400).json({ message: 'Wrong username or password' });
                });
                return [2 /*return*/];
            });
        });
    };
    UserController.prototype.authenticateByNumber = function (body) {
        return __awaiter(this, void 0, void 0, function () {
            var response, mobile, expiresIn;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mobile = body.mobile;
                        expiresIn = parseInt(process.env.TOKEN_EXPIRES, 10);
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                _this.findUserByMobile(mobile).then(function (result) { return __awaiter(_this, void 0, void 0, function () {
                                    var user, userC, token, currentTime, expiresAt, isProfileCompleted;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                user = result;
                                                if (!!user) return [3 /*break*/, 3];
                                                return [4 /*yield*/, this.prisma.user.create({
                                                        data: {
                                                            mobile: mobile,
                                                            firebaseId: body.firebaseId || null,
                                                        }
                                                    })];
                                            case 1:
                                                userC = _a.sent();
                                                return [4 /*yield*/, this.findUserByMobile(userC.mobile)];
                                            case 2:
                                                user = _a.sent();
                                                _a.label = 3;
                                            case 3:
                                                token = jwt.sign({ mobile: mobile }, config_1.default.JWT_SECRET, {
                                                    expiresIn: expiresIn,
                                                });
                                                currentTime = (0, moment_timezone_1.default)().tz('Europe/Helsinki');
                                                expiresAt = currentTime.add(expiresIn, "seconds").format("YYYY-MM-DD HH:mm:ss");
                                                isProfileCompleted = false;
                                                if (user.name && user.age && user.profile.media.id) {
                                                    isProfileCompleted = true;
                                                }
                                                response = __assign(__assign({ user_id: user.id, name: user.name, age: user.age, email: user.email, mobile: mobile, username: user.username, firebaseId: user.firebaseId }, { token: token }), { expires: expiresAt.toString(), isProfileCompleted: isProfileCompleted });
                                                resolve(response);
                                                return [2 /*return*/];
                                        }
                                    });
                                }); });
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
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
    UserController.prototype.getUser = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log(res.locals.user);
                        return [4 /*yield*/, this.prisma.user.findFirst({
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
                            })];
                    case 1:
                        user = _a.sent();
                        return [2 /*return*/, res.status(200).json(user)];
                }
            });
        });
    };
    /**
     * Find user by mobile
     * @param mobile: User's mobile
     */
    UserController.prototype.findUserByMobile = function (mobile) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.user.findUnique({
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
                        })];
                    case 1:
                        user = _a.sent();
                        return [2 /*return*/, user || false];
                }
            });
        });
    };
    /**
     * Find user by email
     * @param userEmail: User's email
     */
    UserController.prototype.findUserByEmail = function (userEmail) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log(userEmail);
                        return [4 /*yield*/, this.prisma.user.findUnique({
                                select: {
                                    id: true, name: true, email: true, username: true, password: true,
                                },
                                where: { email: userEmail },
                            })];
                    case 1:
                        user = _a.sent();
                        return [2 /*return*/, user || false];
                }
            });
        });
    };
    UserController.prototype.getUserProfile = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var loggedUser, user_id, _a, user, followersCount, followingCount, followers, following, memberOf;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        loggedUser = res.locals.user;
                        user_id = parseInt(req.params.id);
                        return [4 /*yield*/, this.prisma.$transaction([
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
                            ])];
                    case 1:
                        _a = _b.sent(), user = _a[0], followersCount = _a[1], followingCount = _a[2], followers = _a[3], following = _a[4], memberOf = _a[5];
                        if (user) {
                            return [2 /*return*/, res.json({ owner: user_id == loggedUser.id ? true : false, user: user, followersCount: followersCount, followingCount: followingCount._count.following + followingCount._count.clubFollowing, followers: followers, following: following, memberOf: memberOf })];
                        }
                        else {
                            res.status(500);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.updateProfile = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var user, _a, name, _b, description, _c, age, userData, profile, extension, key;
            var _this = this;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        user = res.locals.user;
                        _a = req.body, name = _a.name, _b = _a.description, description = _b === void 0 ? null : _b, _c = _a.age, age = _c === void 0 ? null : _c;
                        userData = req.body;
                        if (!userData.name)
                            return [2 /*return*/, res.status(422).send('invalid username')];
                        return [4 /*yield*/, this.prisma.profile.findFirst({
                                where: {
                                    user_id: user.id
                                }
                            })];
                    case 1:
                        profile = _d.sent();
                        if (!!profile) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.prisma.profile.create({
                                data: {
                                    user_id: user.id
                                }
                            })];
                    case 2:
                        _d.sent();
                        _d.label = 3;
                    case 3:
                        if (req.file) {
                            extension = req.file.mimetype.split('/')[1];
                            key = "" + req.file.originalname;
                            this.mediaKeyEntry(req.file.originalname, key, process.env.DO_SPACES_CDN + "/" + key).then(function (result) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, this.updateUserProfile(user, userData, result)];
                                });
                            }); }).then(function (user) {
                                res.json('Success');
                            }).catch(function (error) {
                                console.log(error);
                                res.status(500).json('Something went wrong');
                            });
                        }
                        else {
                            this.updateUserProfileWithoutPicture(user, userData).then(function (user) {
                                res.status(200).json('Success');
                            }).catch(function (error) {
                                console.log(error);
                                res.status(500).json('Something went wrongs' + error);
                            });
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.updateUserProfile = function (user, userData, media) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.prisma.user.update({
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
                                    }).then(function (user) {
                                        resolve(user);
                                    }).catch(function (error) {
                                        reject(error);
                                    })];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    UserController.prototype.updateUserProfileWithoutPicture = function (user, userData) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var obj;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    obj = {};
                                    if (userData.name) {
                                        Object.assign(obj, { name: userData.name });
                                    }
                                    if (userData.age) {
                                        Object.assign(obj, { age: parseInt(userData.age) || null });
                                    }
                                    if (userData.description) {
                                        Object.assign(obj, { profile: { update: { description: userData.description } } });
                                    }
                                    return [4 /*yield*/, this.prisma.user.update({
                                            data: obj,
                                            where: {
                                                id: user.id
                                            }
                                        }).then(function (user) {
                                            resolve(user);
                                        }).catch(function (error) {
                                            reject(error);
                                        })];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    UserController.prototype.getUsersList = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var user, tag, users, users;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = res.locals.user;
                        tag = parseInt(req.query.tag.toString());
                        if (!tag) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.prisma.userHasTags.findMany({
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
                            }).then(function (result) {
                                res.json(result);
                            })];
                    case 1:
                        users = _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.prisma.user.findMany({
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
                        }).then(function (result) {
                            res.json(result);
                        })];
                    case 3:
                        users = _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.mediaKeyEntry = function (id, name, url) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            this.prisma.media.create({
                                data: {
                                    key: id,
                                    name: name,
                                    url: url
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
    UserController.prototype.getNotifications = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                user = res.locals.user;
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
                }).then(function (result) {
                    res.json(result);
                });
                return [2 /*return*/];
            });
        });
    };
    UserController.prototype.addContactList = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var user, requestContact;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = res.locals.user;
                        requestContact = req.body;
                        requestContact = requestContact.map(function (obj) {
                            obj.user_id = user.id;
                            obj.mobile = obj.mobile.replace(/\s/g, '').replace(/[-()+]/g, '');
                            return obj;
                        });
                        return [4 /*yield*/, this.prisma.contactList.deleteMany({ where: { user_id: user.id } })];
                    case 1:
                        _a.sent();
                        this.prisma.contactList.createMany({
                            data: requestContact,
                        }).then(function (result) {
                            return res.send('Inserted successfully!');
                        }).catch(function (error) {
                            res.status(500).json('Something went wrong');
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.getContactList = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            var _this = this;
            return __generator(this, function (_a) {
                user = res.locals.user;
                this.prisma.contactList.findMany({
                    where: { user_id: user.id },
                }).then(function (result) { return __awaiter(_this, void 0, void 0, function () {
                    var cntRes;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, this.processContactList(result, user)];
                            case 1:
                                cntRes = _a.sent();
                                return [2 /*return*/, res.json(cntRes)];
                        }
                    });
                }); }).catch(function (error) {
                    res.status(500).json('Something went wrong');
                });
                return [2 /*return*/];
            });
        });
    };
    UserController.prototype.processContactList = function (result, user) {
        return __awaiter(this, void 0, void 0, function () {
            var resData_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!result) return [3 /*break*/, 2];
                        return [4 /*yield*/, Promise.all(result.map(function (val) { return __awaiter(_this, void 0, void 0, function () {
                                var isUserAvailable, follow;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.prisma.user.count({
                                                where: {
                                                    mobile: val.mobile,
                                                }
                                            })];
                                        case 1:
                                            isUserAvailable = _a.sent();
                                            if (isUserAvailable) {
                                                val.isUserAlreadyExist = true;
                                            }
                                            else {
                                                val.isUserAlreadyExist = false;
                                            }
                                            if (!isUserAvailable) return [3 /*break*/, 3];
                                            return [4 /*yield*/, this.prisma.followers.count({
                                                    where: {
                                                        followingId: val.id,
                                                        followedById: user.id,
                                                    }
                                                })];
                                        case 2:
                                            follow = _a.sent();
                                            if (follow) {
                                                val.follow = true;
                                            }
                                            else {
                                                val.follow = false;
                                            }
                                            return [3 /*break*/, 4];
                                        case 3:
                                            val.follow = false;
                                            _a.label = 4;
                                        case 4: return [2 /*return*/, val];
                                    }
                                });
                            }); }))];
                    case 1:
                        _a.sent();
                        resData_1 = {
                            newUser: [],
                            existingUser: [],
                        };
                        result.forEach(function (element) {
                            if (!element.isUserAlreadyExist) {
                                resData_1.newUser.push(element);
                            }
                            else {
                                resData_1.existingUser.push(element);
                            }
                        });
                        return [2 /*return*/, resData_1];
                    case 2: return [2 /*return*/, []];
                }
            });
        });
    };
    return UserController;
}());
exports.default = UserController;
