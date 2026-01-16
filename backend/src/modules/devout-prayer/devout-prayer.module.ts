import { Module } from '@nestjs/common';
import { DevoutPrayerController } from './devout-prayer.controller';
import { DevoutPrayerService } from './devout-prayer.service';
import { PrismaModule } from '../../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DevoutPrayerController],
  providers: [DevoutPrayerService],
  exports: [DevoutPrayerService],
})
export class DevoutPrayerModule {}
