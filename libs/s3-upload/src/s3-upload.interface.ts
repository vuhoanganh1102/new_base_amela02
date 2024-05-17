export interface S3uploadOptions {
  secretAccessKey: string;
  accessKeyId: string;
  maxFiles: number;
  region: string;
  bucket: string;
  domain: string;
  thumbs: string[];
}
