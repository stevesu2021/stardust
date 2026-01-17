import { Module } from '@nestjs/common';
import { DailyFortuneController } from './daily-fortune.controller';
import { DailyFortuneService } from './daily-fortune.service';
import { PrismaModule } from '../../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DailyFortuneController],
  providers: [DailyFortuneService],
  exports: [DailyFortuneService],
})
export class DailyFortuneModule {}
