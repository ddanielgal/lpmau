import { Module } from '@nestjs/common';
import { NestMinioModule } from 'nestjs-minio';
import { FilestoreService } from './filestore.service';

@Module({
  imports: [
    NestMinioModule.register({
      endPoint: 'localhost',
      port: 9000,
      useSSL: false,
      accessKey: 'minio',
      secretKey: 'miniosecret',
    }),
  ],
  providers: [FilestoreService],
  exports: [FilestoreService],
})
export class FilestoreModule {}
