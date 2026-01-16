import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { AvatarController } from './avatar.controller';
import { AvatarService } from './avatar.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import { MinioModule } from '../../common/minio/minio.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    MinioModule,
    MulterModule.register({
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  ],
  controllers: [AvatarController],
  providers: [AvatarService, PrismaService],
  exports: [AvatarService],
})
export class AvatarModule {}
