import AWS from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-sharp-s3';

export default class AmazonWebServices {
    static spacesEndpoint = new AWS.Endpoint('fra1.digitaloceanspaces.com'!);
    static s3 = new AWS.S3({endpoint: AmazonWebServices.spacesEndpoint, accessKeyId: 'N2DSHF5L6DC67UJYG7YU', secretAccessKey: 'u0fwYzAa460DFgNv192oFmPnpeUla3W0KRim893GkbU'});
    static bucketParams = {
        Bucket : 'play-media',
    };

    static upload = multer({
        storage: multerS3({
          s3: AmazonWebServices.s3,
          Bucket: AmazonWebServices.bucketParams.Bucket,
          ACL: 'public-read',
          Key: function (request: any, file: any, cb: any) {
            const extension = file.mimetype.split('/')[1];
            // const key = `${file.originalname}`;
            let explodeName = file.originalname.split('.');
            const ext = explodeName[explodeName.length-1];
            const timestamp = new Date().getTime().toString();
            const key = timestamp + '.' + ext;
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

      static uploadPost = multer({
        storage: multerS3({
          s3: AmazonWebServices.s3,
          Bucket: AmazonWebServices.bucketParams.Bucket,
          ACL: 'public-read',
          Key: function (request: any, file: any, cb: any) {
            const extension = file.mimetype.split('/')[1];
            const key = `${file.originalname}`;
            cb(null, key);
          },
        }),
        limits: { fileSize: 20000000 },
      }).array('files', 2);
}