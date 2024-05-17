import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigurableModuleClass } from './jwt-authentication.module-definition';
import { JwtAuthenticationService } from './jwt-authentication.service';

@Global()
@Module({
  imports: [JwtModule],
  providers: [JwtAuthenticationService],
  exports: [JwtAuthenticationService],
})
export class JwtAuthenticationModule extends ConfigurableModuleClass {}
