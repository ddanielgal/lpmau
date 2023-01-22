import { Module } from '@nestjs/common';
import { Gateway } from './gateway.controller';
import { FilestoreModule } from './filestore/filestore.module';
import { DatabaseModule } from './database/database.module';
import { QueueModule } from './queue/queue.module';
import { OrchestratorService } from './orchestrator.service';

@Module({
  controllers: [Gateway],
  providers: [OrchestratorService],
  imports: [FilestoreModule, DatabaseModule, QueueModule],
})
export class AppModule {}
