import { Module } from '@nestjs/common';
import { AstrologyServiceModule } from './astrology.service';
import { AstrologyController } from './astrology.controller';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { AstrologyService } from '../../common/utils/astrology.utils';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [AstrologyController],
  providers: [AstrologyServiceModule, AstrologyService],
  exports: [AstrologyServiceModule],
})
export class AstrologyModule {}