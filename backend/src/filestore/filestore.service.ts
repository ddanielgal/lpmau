import { Inject, Injectable } from '@nestjs/common';
import { Client } from 'minio';
import { MINIO_CONNECTION } from 'nestjs-minio';

@Injectable()
export class FilestoreService {
  constructor(@Inject(MINIO_CONNECTION) private readonly minio: Client) {}

  async upload(key: string, file: Buffer) {
    return this.minio.putObject('files', key, file);
  }
}
