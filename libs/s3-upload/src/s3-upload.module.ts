import { Global, Module } from '@nestjs/common';
import { ConfigurableModuleClass } from './s3-upload.module-definition';
import { S3UploadService } from './s3-upload.service';

@Global()
@Module({
  providers: [S3UploadService],
  exports: [S3UploadService],
})
export class S3UploadModule extends ConfigurableModuleClass {}
