import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { ContentService } from './content.service';
import { ContentController } from './content.controller';
import { ContentGenerationService } from './content-generation.service';
import { ContentAdminController } from './content-admin.controller';
import { ContentCronService } from './content-cron.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [ContentController, ContentAdminController],
  providers: [ContentService, ContentGenerationService, ContentCronService],
})
export class ContentModule {}
