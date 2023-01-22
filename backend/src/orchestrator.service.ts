import { Injectable } from '@nestjs/common';
import * as path from 'path';
import { DatabaseService } from './database/database.service';
import { FilestoreService } from './filestore/filestore.service';
import { QueueService } from './queue/queue.service';

@Injectable()
export class OrchestratorService {
  constructor(
    private readonly filestore: FilestoreService,
    private readonly database: DatabaseService,
    private readonly queue: QueueService,
  ) {}

  async submitJob(input: Record<string, unknown>) {
    const job = await this.database.createJob(input);
    await this.queue.sendToWorker(job);
    return job;
  }

  async jobReceived(id: number) {
    await this.database.setJobStatus(id, 'processing');
  }

  async jobFailed(id: number) {
    await this.database.setJobStatus(id, 'failed');
  }

  async finishJob(id: number, file: Express.Multer.File) {
    const key = `${id}${path.extname(file.originalname)}`;
    await this.filestore.upload(key, file.buffer);
    await this.database.setJobStatus(id, 'finished');
    return this.database.addResult(id, path.join('files', key));
  }

  async getJobs() {
    return this.database.getJobs();
  }

  async deleteJob(id: number) {
    return this.database.deleteJob(id);
  }
}
