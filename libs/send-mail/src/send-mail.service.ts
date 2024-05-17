import { Inject, Injectable, Logger } from '@nestjs/common';
// @ts-ignore
import * as sgMail from '@sendgrid/mail';
import { SendMailDto } from './send-mail.dto';
import { SendMailModuleOptions } from './send-mail.interface';
import { MODULE_OPTIONS_TOKEN } from './send-mail.module-definition';

@Injectable()
export class SendMailService {
  private readonly logger: Logger = new Logger(SendMailService.name);

  constructor(
    @Inject(MODULE_OPTIONS_TOKEN)
    public readonly options: SendMailModuleOptions,
  ) {
    sgMail.setApiKey(this.options.apiKey);
  }

  async sendMail(data: SendMailDto) {
    const mail = {
      from: this.options.sender,
      to: data.receiver,
      subject: data.subject,
      text: data.content,
      html: data.html,
    };

    try {
      const info = await sgMail.send(mail);
      this.logger.log(`Email sent! Info: ${info}`);
    } catch (error) {
      this.logger.log('Send mail failed!: ', error.response.body);
    }
  }
}
