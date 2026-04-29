import { Global, Module } from '@nestjs/common';
import { appConfigProvider } from './app-config.provider';

@Global()
@Module({
  providers: [appConfigProvider],
  exports: [appConfigProvider]
})
export class ConfigModule {}
