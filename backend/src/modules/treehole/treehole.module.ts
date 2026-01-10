import { Module } from '@nestjs/common';
import { TreeholeService } from './treehole.service';
import { TreeholeController } from './treehole.controller';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [TreeholeController],
  providers: [TreeholeService],
  exports: [TreeholeService],
})
export class TreeholeModule {}