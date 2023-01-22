import axios, { AxiosInstance } from "axios";
import * as amqplib from "amqplib";
import { backOff } from "exponential-backoff";
import * as fs from "fs";
import * as FormData from "form-data";

type Job = {
  id: number;
  status: string;
  result?: string;
  input: Record<string, unknown>;
};

type Operation = (input: Record<string, unknown>) => Promise<fs.PathLike>;

const QUEUE = "job-start";

export class Worker {
  private broker: string;
  private job: Operation;
  private api: AxiosInstance;
  private channel: amqplib.Channel;

  constructor(broker: string, api: string, operation: Operation) {
    this.broker = broker;
    this.job = operation;
    this.api = axios.create({ baseURL: api });
  }

  private async onMessage(message: amqplib.ConsumeMessage) {
    this.channel.ack(message);
    const {
      data: { id, input },
    } = JSON.parse(message.content.toString());
    const file = await this.job(input);
    const data = new FormData();
    data.append("file", fs.createReadStream(file));
    await this.api.patch(`/jobs/${id}`, data, {
      headers: data.getHeaders(),
    });
  }

  async listen() {
    const connection = await backOff(async () => amqplib.connect(this.broker), {
      retry: (_, attemptNumber) => {
        console.log(
          `Connecting to ${this.broker}, attempt ${attemptNumber} ...`
        );
        return true;
      },
    });
    this.channel = await connection.createChannel();
    await this.channel.assertQueue(QUEUE);
    console.log(`Listening to ${QUEUE} messages`);
    await this.channel.consume(QUEUE, this.onMessage.bind(this));
  }
}

export class Client {
  private api: AxiosInstance;

  constructor(connection: string) {
    this.api = axios.create({ baseURL: connection });
  }

  async submitJob(input: Record<string, unknown>): Promise<Job> {
    const { data: job } = await this.api.post("/jobs", input);
    return job;
  }

  async getJobs() {
    const { data: jobs } = await this.api.get<Job[]>("/jobs");
    return jobs;
  }

  async deleteJob(id: number) {
    await this.api.delete(`/jobs/${id}`);
  }
}
