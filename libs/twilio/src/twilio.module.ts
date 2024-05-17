import { Global, Module } from '@nestjs/common';
import { ConfigurableModuleClass } from './twilio.module-definition';
import { TwilioService } from './twilio.service';

@Global()
@Module({
  providers: [TwilioService],
  exports: [TwilioService],
})
export class TwilioModule extends ConfigurableModuleClass {}
