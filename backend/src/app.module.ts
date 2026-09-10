import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
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
import { FaceModule } from './modules/face/face.module';
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
    // 全局限流：同一 IP 每 60 秒最多 60 次请求（nginx 层另有 30r/s 粗过滤）
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60_000,
        limit: 60,
      },
    ]),
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
    FaceModule,
    AvatarModule,
    MbtiModule,
    DailyFortuneModule,
    FamousPeopleModule,
    ProductModule,
  ],
  // 登录态前即可触发的公共端点全部受全局限流保护
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}