import { Module } from '@nestjs/common';
import { getModelToken, SequelizeModule } from '@nestjs/sequelize';
import UserService from './user.service';
import User from './models/user.model';
import Role from '../role/models/role.model';
import UserController from "./user.controller";

@Module({
  imports: [
    SequelizeModule.forFeature([User]),
  ],
  providers: [
    UserService,
    {
      provide: getModelToken(User),
      useValue: User,
    },
    {
      provide: getModelToken(Role),
      useValue: Role,
    },
  ],
  controllers: [UserController],
  exports: [UserService],
})

export default class UserModule {}
