import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Job } from '../types';

@Injectable()
export class QueueService {
  constructor(
    @Inject('JobsMessagingClient') private readonly rmq: ClientProxy,
  ) {}

  async sendToWorker(job: Job) {
    return firstValueFrom(this.rmq.emit('job-start', job));
  }
}
