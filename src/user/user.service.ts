import { Injectable, Inject } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { getModelToken } from '@nestjs/sequelize';
import { Includeable } from 'sequelize/types/model';
import { NotEnoughRightsException } from '../common/exceptions';
import { RoleNotFoundException } from '../role/exceptions';
import {
  CreateUserDto,
} from './dto';
import { Action, AppAbility, CaslAbilityFactory } from '../casl/casl-ability.factory';
import User, { UserCreationAttrs } from './models/user.model';
import Role from '../role/models/role.model';
import { StatusDto } from '../common/dto';
import {UserNotFoundException} from "./exceptions";

@Injectable()
export default class UserService {
  constructor(
    @Inject(getModelToken(User))
    private userRepository: typeof User,
    @Inject(getModelToken(Role))
    private roleRepository: typeof Role,
    private abilityFactory: CaslAbilityFactory,
  ) {}

  async findByEmail(email: string, include: Includeable[] = []): Promise<User> {
    const user: User = await this.userRepository.findOne({
      where: { email, deletedAt: null },
      include,
    });

    return user;
  }

  async createUser(userDto: CreateUserDto): Promise<User> {
    const role: Role = await this.roleRepository.findOne({ where: { name: 'user' } });
    if (!role) {
      throw new RoleNotFoundException();
    }
    const hashPassword: string = await bcrypt.hash(userDto.password, 5);
    const userCreationAttrs: UserCreationAttrs = {
      ...userDto,
      passwordHash: hashPassword,
      roleId: role.id,
    };
    const user: User = await this.userRepository.create(userCreationAttrs);

    const isUser: User = await this.userRepository.findByPk(user.id, { include: [Role] });

    return isUser;
  }

  async delete(
      id: number,
      currentUser: User,
  ): Promise<StatusDto> {
    const user: User = await this.userRepository.findOne({
      where: { id, deletedAt: null },
    });
    if (!user) {
      throw new UserNotFoundException();
    }

    const ability: AppAbility = this.abilityFactory.createForUser(currentUser);
    const hasAccess: boolean = ability.can(Action.Manage, 'all')
        || ability.can(Action.Manage, User)
        || ability.can(Action.Update, user);
    if (!hasAccess) {
      throw new NotEnoughRightsException();
    }

    await this.userRepository.update({
      deletedAt: new Date(),
    }, {
      where: { id },
      individualHooks: true,
    });

    return { status: true };
  }
}
