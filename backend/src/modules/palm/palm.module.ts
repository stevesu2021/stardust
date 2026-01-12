import { Module } from '@nestjs/common';
import { PalmController } from './palm.controller';
import { PalmService } from './palm.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [PalmController],
  providers: [PalmService],
  exports: [PalmService],
})
export class PalmModule {}
