import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { QueueService } from './queue.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'JobsMessagingClient',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.MESSAGE_BROKER_URL],
          queue: 'job-start',
        },
      },
    ]),
  ],
  providers: [QueueService],
  exports: [QueueService],
})
export class QueueModule {}
