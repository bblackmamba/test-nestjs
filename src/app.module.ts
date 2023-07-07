import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { ApplicationModule } from './application/application.module';
import { ApplicationCommentModule } from './application-comment/application-comment.module';
import UserModule from "./user/user.module";
import AuthModule from "./auth/auth.module";
import TokenModule from "./token/token.module";
import CaslModule from "./casl/casl.module";
import RoleModule from "./role/role.module";
import {APP_GUARD, APP_INTERCEPTOR} from "@nestjs/core";
import AccessTokenGuard from "./common/guards/access-token.guard";
import RolesGuard from "./common/guards/roles.guard";
import AppInterceptor from "./common/interceptors/app.interceptor";

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.PG_HOST,
      port: Number(process.env.PG_PORT),
      username: process.env.PG_USERNAME,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DATABASE,
      autoLoadModels: true,
      synchronize: true,
      omitNull: true,
    }),
    AuthModule,
    UserModule,
    TokenModule,
    CaslModule,
    RoleModule,
    ApplicationModule,
    ApplicationCommentModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: AppInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ]
})
export class AppModule {}
