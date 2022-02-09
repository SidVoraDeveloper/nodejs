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
var uuid_1 = require("uuid");
var client_1 = require("@prisma/client");
var PostController = /** @class */ (function () {
    function PostController() {
        this.amazonWebServices = new awsController_1.default();
        this.prisma = new client_1.PrismaClient();
        this.fileSizeLimit = 100000000;
    }
    PostController.prototype.upload = function (user_id, file) {
        return __awaiter(this, void 0, void 0, function () {
            var userObj, id;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.user.findUnique({
                            where: {
                                id: user_id,
                            },
                        })];
                    case 1:
                        userObj = _a.sent();
                        id = uuid_1.v4();
                        this.uploadS3(req, res, id).then(function (result) {
                            console.log(result);
                            return _this.mediaKeyEntry(id, result, process.env.DO_SPACES_CDN + "/" + result);
                        }).then(function () {
                            res.status(200).json('File uploaded successfully');
                        }).catch(function (error) {
                            console.log(error);
                            res.status(500).json('Something went wrong');
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    PostController.prototype.mediaKeyEntry = function (id, name, url) {
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
    PostController.prototype.uploadS3 = function (req, res, id) {
        return __awaiter(this, void 0, void 0, function () {
            var key;
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var uploadS3 = multer_1.default({
                            storage: multer_s3_1.default({
                                s3: _this.amazonWebServices.s3,
                                bucket: _this.amazonWebServices.bucketParams.Bucket,
                                acl: 'public-read',
                                key: function (request, file, cb) {
                                    var extension = file.mimetype.split('/')[1];
                                    key = id + "." + extension;
                                    cb(null, id + "." + extension);
                                }
                            }),
                            limits: { fileSize: _this.fileSizeLimit },
                        }).array('upload', 1);
                        uploadS3(req, res, function (error) {
                            if (error) {
                                reject(error);
                            }
                            else {
                                resolve(key);
                            }
                        });
                    })];
            });
        });
    };
    return PostController;
}());
exports.default = PostController;
