import { Module } from '@nestjs/common';
import { FamousPeopleController } from './famous-people.controller';
import { FamousPeopleService } from './famous-people.service';
import { PrismaModule } from '../../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FamousPeopleController],
  providers: [FamousPeopleService],
  exports: [FamousPeopleService],
})
export class FamousPeopleModule {}
