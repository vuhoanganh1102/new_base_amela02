import { Module } from '@nestjs/common';
import { ConfigurableModuleClass } from './send-mail.module-definition';
import { SendMailService } from './send-mail.service';

@Module({
  providers: [SendMailService],
  exports: [SendMailService],
})
export class SendMailModule extends ConfigurableModuleClass {}
