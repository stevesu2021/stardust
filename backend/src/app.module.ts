import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './common/prisma/prisma.module';
import { MinioModule } from './common/minio/minio.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { AstrologyModule } from './modules/astrology/astrology.module';
import { PrayerModule } from './modules/prayer/prayer.module';
import { ConfessionModule } from './modules/confession/confession.module';
import { TreeholeModule } from './modules/treehole/treehole.module';
import { DatingModule } from './modules/dating/dating.module';
import { PalmModule } from './modules/palm/palm.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    MinioModule,
    AuthModule,
    UserModule,
    AstrologyModule,
    PrayerModule,
    ConfessionModule,
    TreeholeModule,
    DatingModule,
    PalmModule,
  ],
})
export class AppModule {}