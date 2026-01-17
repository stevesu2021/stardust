import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './common/prisma/prisma.module';
import { MinioModule } from './common/minio/minio.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { AstrologyModule } from './modules/astrology/astrology.module';
import { PrayerModule } from './modules/prayer/prayer.module';
import { DevoutPrayerModule } from './modules/devout-prayer/devout-prayer.module';
import { ReunitePrayerModule } from './modules/reunite-prayer/reunite-prayer.module';
import { ConfessionModule } from './modules/confession/confession.module';
import { TreeholeModule } from './modules/treehole/treehole.module';
import { DatingModule } from './modules/dating/dating.module';
import { PalmModule } from './modules/palm/palm.module';
import { AvatarModule } from './modules/avatar/avatar.module';
import { MbtiModule } from './modules/mbti/mbti.module';
import { DailyFortuneModule } from './modules/daily-fortune/daily-fortune.module';
import { FamousPeopleModule } from './modules/famous-people/famous-people.module';
import { ProductModule } from './modules/product/product.module';

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
    DevoutPrayerModule,
    ReunitePrayerModule,
    ConfessionModule,
    TreeholeModule,
    DatingModule,
    PalmModule,
    AvatarModule,
    MbtiModule,
    DailyFortuneModule,
    FamousPeopleModule,
    ProductModule,
  ],
})
export class AppModule {}