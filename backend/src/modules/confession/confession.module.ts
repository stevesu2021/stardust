import { Module } from '@nestjs/common';
import { ConfessionService } from './confession.service';
import { ConfessionController } from './confession.controller';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [ConfessionController],
  providers: [ConfessionService],
  exports: [ConfessionService],
})
export class ConfessionModule {}