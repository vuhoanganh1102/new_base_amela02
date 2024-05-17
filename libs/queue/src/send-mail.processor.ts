import {
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { QueueName, QueueProcessor } from '@app/core/constants/enum';
import { SendMailService } from '@app/send-mail';

@Processor(QueueProcessor.SEND_MAIL)
export class SendMailQueue {
  private readonly logger = new Logger(SendMailQueue.name);

  constructor(private readonly sendMailService: SendMailService) {}

  @Process(QueueName.SEND_MAIL)
  async handleSendmailQueue(job: Job<any>) {
    this.logger.log('send mail - handle : ', job.data);
    await this.sendMailService.sendMail(job.data);
  }

  @OnQueueCompleted()
  async onCompleted(job: Job, result: any) {
    this.logger.log(`Queue - Complete: ${job.id}\n`);
  }

  @OnQueueFailed()
  async onQueueFailed(job: Job, err: Error) {
    this.logger.log(
      `Queue - failed: ${job.id}.\n Reason: ${job.failedReason}\n`,
    );
  }
}
