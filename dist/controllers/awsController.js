"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var aws_sdk_1 = __importDefault(require("aws-sdk"));
var multer_1 = __importDefault(require("multer"));
var multer_sharp_s3_1 = __importDefault(require("multer-sharp-s3"));
var AmazonWebServices = /** @class */ (function () {
    function AmazonWebServices() {
    }
    AmazonWebServices.spacesEndpoint = new aws_sdk_1.default.Endpoint('fra1.digitaloceanspaces.com');
    AmazonWebServices.s3 = new aws_sdk_1.default.S3({ endpoint: AmazonWebServices.spacesEndpoint, accessKeyId: 'N2DSHF5L6DC67UJYG7YU', secretAccessKey: 'u0fwYzAa460DFgNv192oFmPnpeUla3W0KRim893GkbU' });
    AmazonWebServices.bucketParams = {
        Bucket: 'play-media',
    };
    AmazonWebServices.upload = (0, multer_1.default)({
        storage: (0, multer_sharp_s3_1.default)({
            s3: AmazonWebServices.s3,
            Bucket: AmazonWebServices.bucketParams.Bucket,
            ACL: 'public-read',
            Key: function (request, file, cb) {
                var extension = file.mimetype.split('/')[1];
                // const key = `${file.originalname}`;
                var explodeName = file.originalname.split('.');
                var ext = explodeName[explodeName.length - 1];
                var timestamp = new Date().getTime().toString();
                var key = timestamp + '.' + ext;
                file.originalname = key;
                cb(null, key);
            },
            resize: {
                width: 200,
                height: 200,
            },
        }),
        limits: { fileSize: 1000000 },
    }).single('file');
    AmazonWebServices.uploadPost = (0, multer_1.default)({
        storage: (0, multer_sharp_s3_1.default)({
            s3: AmazonWebServices.s3,
            Bucket: AmazonWebServices.bucketParams.Bucket,
            ACL: 'public-read',
            Key: function (request, file, cb) {
                var extension = file.mimetype.split('/')[1];
                var key = "" + file.originalname;
                cb(null, key);
            },
        }),
        limits: { fileSize: 20000000 },
    }).array('files', 2);
    return AmazonWebServices;
}());
exports.default = AmazonWebServices;
