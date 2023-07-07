import { Inject, Injectable } from "@nestjs/common";
import { getModelToken } from "@nestjs/sequelize";
import User from "../user/models/user.model";
import Application from "./models/application.model";
import {
  ApplicationsDto,
  CreateApplicationDto,
  FindAllApplicationsDto,
  UpdateStatusDto,
} from "./dto";
import { ApplicationNotFoundException } from "./exceptions";
import { StatusDto } from "../common/dto";
import ADMIN_ROLES from "../role/consts/admin-roles.const";
import RolesEnum from "../role/enums/roles.enum";
import ApplicationComment from "../application-comment/models/application-comment.model";
import { FindOptions, Op } from "sequelize";
import { Action, AppAbility, CaslAbilityFactory } from "../casl/casl-ability.factory";
import { NotEnoughRightsException } from "../common/exceptions";

@Injectable()
export default class ApplicationService {
  constructor(
    @Inject(getModelToken(Application))
    private applicationRepository: typeof Application,
    private abilityFactory: CaslAbilityFactory,
  ) {}

  async findAll(findDto: FindAllApplicationsDto, currentUser: User): Promise<ApplicationsDto> {
    const query: FindOptions = {
      where: {
        ...(findDto.status ? {
          status: findDto.status,
        } : {}),
        [Op.and]: [
          {
            ...(ADMIN_ROLES.includes(currentUser.role.name as RolesEnum) ? {}
              : {publisherId: currentUser.id}),
          },
          {
            ...(findDto.userId ? {
              publisherId: findDto.userId,
            } : {}),
          }
        ]
      },
      include: [ApplicationComment],
      limit: findDto.limit || 20,
      offset: findDto.offset || 0,
      order: [findDto.order || ['id', 'asc']],
    };
    const applications = await this.applicationRepository.findAndCountAll(query);

    return applications;
  }

  async create(createDto: CreateApplicationDto, currentUser: User): Promise<Application> {
    const application = await this.applicationRepository.create({
      publisherId: currentUser.id,
      message: createDto.message,
    })

    return application
  }

  async update(
    id: number,
    updateDto: CreateApplicationDto,
    currentUser: User,
  ): Promise<Application> {
    const application = await this.applicationRepository.findOne({
      where: {
        id,
        publisherId: currentUser.id,
      },
    });
    if (!application) {
      throw new ApplicationNotFoundException();
    }

    await this.applicationRepository.update({
      message: updateDto.message,
    }, {
      where: { id: application.id },
    });
    const result = await this.applicationRepository.findByPk(application.id);

    return result;
  }

  async updateStatus(
    id: number,
    updateDto: UpdateStatusDto,
    currentUser: User,
  ): Promise<Application> {
    const ability: AppAbility = this.abilityFactory.createForUser(currentUser);
    const hasAccess: boolean = ability.can(Action.Manage, 'all');
    if (!hasAccess) {
      throw new NotEnoughRightsException();
    }

    const application = await this.applicationRepository.findOne({
      where: {
        id,
      },
    });
    if (!application) {
      throw new ApplicationNotFoundException();
    }

    await this.applicationRepository.update({
      status: updateDto.status,
    }, {
      where: { id: application.id },
    });
    const result = await this.applicationRepository.findByPk(application.id);

    return result;
  }

  async delete(
    id: number,
    currentUser: User,
  ): Promise<StatusDto> {
    const application = await this.applicationRepository.findOne({
      where: {
        id,
      },
    });
    if (!application) {
      throw new ApplicationNotFoundException();
    }

    const ability: AppAbility = this.abilityFactory.createForUser(currentUser);
    const hasAccess: boolean = ability.can(Action.Manage, 'all')
      || ability.can(Action.Delete, Application);
    if (!hasAccess) {
      throw new NotEnoughRightsException();
    }

    await this.applicationRepository.destroy({ where: { id: application.id } });

    return { status: true };
  }
}
