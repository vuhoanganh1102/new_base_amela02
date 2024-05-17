import { Inject, Injectable, Logger } from '@nestjs/common';
// @ts-ignore
import * as twilio from 'twilio';
import { TwilioModuleOptions } from './twilio.interface';
import { MODULE_OPTIONS_TOKEN } from './twilio.module-definition';

@Injectable()
export class TwilioService {
  private readonly logger: Logger = new Logger(TwilioService.name);
  private readonly client: twilio.Twilio;

  constructor(
    @Inject(MODULE_OPTIONS_TOKEN)
    public readonly options: TwilioModuleOptions,
  ) {
    this.client = twilio(options.sid, options.authToken);
  }

  async sendSms(phone: string, body: string) {
    try {
      if (phone.startsWith('84') || phone.startsWith('84')) phone = '+' + phone;
      //JP
      //if (phone.startsWith('0')) phone = '+81' + phone.substr(1);
      if (phone.startsWith('0')) phone = '+84' + phone.substring(1);
      const from = this.options.phoneNumber;
      const sendSms = await this.client.messages.create({
        body,
        from,
        to: phone,
      });
      this.logger.log(`SEND SMS PHONE: ${phone} DONE | ID: ${sendSms.sid}`);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
