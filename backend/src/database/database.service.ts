import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class DatabaseService {
  constructor(private readonly prisma: PrismaService) {}

  async getJobs() {
    return this.prisma.job.findMany();
  }

  async createJob(input: Record<string, unknown>) {
    return this.prisma.job.create({
      data: {
        status: 'queued',
        input: JSON.stringify(input),
      },
    });
  }

  async setJobStatus(id: number, status: string) {
    return this.prisma.job.update({
      where: { id },
      data: { status },
    });
  }

  async addResult(id: number, result: string) {
    return this.prisma.job.update({
      where: { id },
      data: { result },
    });
  }

  async deleteJob(id: number) {
    return this.prisma.job.delete({
      where: { id },
    });
  }
}
