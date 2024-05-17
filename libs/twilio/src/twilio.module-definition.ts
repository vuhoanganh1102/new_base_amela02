import { ConfigurableModuleBuilder } from '@nestjs/common';
import { TwilioModuleOptions } from './twilio.interface';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<TwilioModuleOptions>().build();
