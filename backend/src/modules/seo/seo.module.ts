// backend/src/modules/seo/seo.module.ts
import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { SeoService } from './seo.service';
import { SeoController } from './seo.controller';
import { SeoAdminController } from './seo-admin.controller';

@Module({
  imports: [PrismaModule],
  controllers: [SeoController, SeoAdminController],
  providers: [SeoService],
  exports: [SeoService],
})
export class SeoModule {}
