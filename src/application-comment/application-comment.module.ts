import { Module } from '@nestjs/common';
import { ApplicationCommentController } from './application-comment.controller';
import {getModelToken, SequelizeModule} from "@nestjs/sequelize";
import ApplicationComment from "./models/application-comment.model";
import ApplicationCommentService from "./application-comment.service";
import Application from "../application/models/application.model";

@Module({
  imports: [
    SequelizeModule.forFeature([ApplicationComment]),
  ],
  providers: [
    ApplicationCommentService,
    {
      provide: getModelToken(Application),
      useValue: Application,
    },
    {
      provide: getModelToken(ApplicationComment),
      useValue: ApplicationComment,
    },
  ],
  controllers: [ApplicationCommentController]
})
export class ApplicationCommentModule {}
