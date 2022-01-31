import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { V2rayController } from './v2ray/v2rayController';
import { V2rayService } from './v2ray/v2rayService';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import { UpdateV2raySubsriptionCronService } from './v2ray/UpdateV2raySubsriptionCronService';
import { LoginController } from './login/login.controller';
import { LoginService } from './login/login.service';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { openDb } from './sqlite/db';
import { UserProvider } from './user/user.provider';
import { LogoutController } from './login/logout.controller';

@Module({
  imports: [ScheduleModule.forRoot(), HttpModule],
  controllers: [
    AppController,
    V2rayController,
    LoginController,
    UserController,
    LogoutController
  ],
  providers: [
    AppService,
    V2rayService,
    UpdateV2raySubsriptionCronService,
    LoginService,
    UserService,
    {
      provide: 'DATABASE',
      useValue: openDb(),
    },
    UserProvider
  ],
})
export class AppModule {}
