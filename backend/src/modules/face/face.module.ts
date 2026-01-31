import { Module } from '@nestjs/common';
import { FaceController } from './face.controller';
import { FaceService } from './face.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [FaceController],
  providers: [FaceService],
  exports: [FaceService],
})
export class FaceModule {}
