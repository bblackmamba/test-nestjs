import { Module } from '@nestjs/common';
import { ApplicationController } from './application.controller';
import {getModelToken, SequelizeModule} from "@nestjs/sequelize";
import Application from "./models/application.model";
import ApplicationService from "./application.service";
import ApplicationComment from "../application-comment/models/application-comment.model";

@Module({
  imports: [
    SequelizeModule.forFeature([Application]),
  ],
  providers: [
    ApplicationService,
    {
      provide: getModelToken(Application),
      useValue: Application,
    },
    {
      provide: getModelToken(ApplicationComment),
      useValue: ApplicationComment,
    },
  ],
  controllers: [ApplicationController]
})
export class ApplicationModule {}
