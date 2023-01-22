import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { OrchestratorService } from './orchestrator.service';

@Controller('jobs')
export class Gateway {
  constructor(private readonly orchestrator: OrchestratorService) {}

  @Post()
  async submitJob(@Body() input: Record<string, unknown>) {
    return this.orchestrator.submitJob(input);
  }

  @Get()
  async getJobs() {
    return this.orchestrator.getJobs();
  }

  @Post(':id/finished')
  @UseInterceptors(FileInterceptor('file'))
  async finishJob(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      return this.orchestrator.jobReceived(id);
    }
    return this.orchestrator.finishJob(id, file);
  }

  @Post(':id/received')
  async jobReceived(@Param('id', ParseIntPipe) id: number) {
    return this.orchestrator.jobReceived(id);
  }

  @Post(':id/failed')
  async jobFailed(@Param('id', ParseIntPipe) id: number) {
    return this.orchestrator.jobFailed(id);
  }

  @Delete(':id')
  async deleteJob(@Param('id', ParseIntPipe) id: number) {
    return this.orchestrator.deleteJob(id);
  }
}
