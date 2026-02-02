import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { FaceController } from './face.controller';
import { FaceService } from './face.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    MulterModule.register({
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  ],
  controllers: [FaceController],
  providers: [FaceService],
  exports: [FaceService],
})
export class FaceModule {}
