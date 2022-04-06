import aws from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
// import slugify from 'slugify';
import path from 'path';

const s3 = new aws.S3({ region: 'ap-northeast-2' });

export const uploadBankAccountImage = multer({
  storage: multerS3({
    s3,
    bucket: 'test-static',
    key(req, file, cb) {
      const originalFile = path.parse(file.originalname);
      cb(
        null,
        `adpartner/bankAccountImages/${req.params.adptnId}-bankAccount${originalFile.ext}`,
      );
    },
  }),
});
