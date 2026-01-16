import { Module } from '@nestjs/common';
import { ReunitePrayerController } from './reunite-prayer.controller';
import { ReunitePrayerService } from './reunite-prayer.service';
import { PrismaModule } from '../../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ReunitePrayerController],
  providers: [ReunitePrayerService],
  exports: [ReunitePrayerService],
})
export class ReunitePrayerModule {}
