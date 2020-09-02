import { S3 } from 'aws-sdk';
import { readFileSync } from 'fs';
import { prop, sortBy } from 'ramda';
import { environment } from '../environments/environment';

export interface IFile extends File {
  path: string;
}

class FileService {
  private get _s3() {
    return new S3({
      accessKeyId: environment.awsId,
      secretAccessKey: environment.awsSecret,
    });
  }

  upload(file: IFile): Promise<string> {
    const fileContent = readFileSync(file.path);
    const params: S3.PutObjectRequest = {
      Bucket: environment.awsBucketName,
      Key: file.name,
      Body: fileContent,
      ACL: 'public-read',
    };

    return new Promise((resolve: (value: string) => void, reject: (reason?: any) => void) => {
      this._s3.upload(params, (err: Error, data: S3.ManagedUpload.SendData) => {
        if (err) {
          reject(err);
        }

        console.log(`File uploaded successfully. ${data.Location}`);

        resolve(data.Location);
      });
    });
  }

  list(
    sortStrategy: (list: S3.ObjectList) => S3.ObjectList = sortBy(prop('LastModified')),
  ): Promise<string[]> {
    return new Promise((resolve: (value: string[]) => void, reject: (reason?: any) => void) => {
      const params2 = {
        Bucket: environment.awsBucketName,
        Delimiter: '',
      };

      this._s3.listObjects(params2, (err, { Contents = [] }: S3.ListObjectsOutput) => {
        if (err) {
          reject(err);
        }

        const paths = sortStrategy(Contents).map(({ Key }: S3.Object) => this._getObjectPath(Key));

        resolve(paths);
      });
    });
  }

  private _getObjectPath(key: string) {
    return `https://${environment.awsBucketName}.s3.amazonaws.com/${key}`;
  }
}

export const FileServiceInstance = new FileService();
