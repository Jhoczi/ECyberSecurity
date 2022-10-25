import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserController } from './controllers/user.controller';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { LogModule } from './log/logs.module';

@Module({
  imports: [AuthModule, PrismaModule, UserModule, LogModule],
  controllers: [AppController, UserController],
  providers: [AppService],
})
export class AppModule {}
