import {Inject, Injectable} from "@nestjs/common";
import {getModelToken} from "@nestjs/sequelize";
import ApplicationComment from "./models/application-comment.model";
import CreateApplicationCommentDto from "./dto/create-application-comment.dto";
import User from "../user/models/user.model";
import {ApplicationNotFoundException} from "../application/exceptions";
import {Action, AppAbility, CaslAbilityFactory} from "../casl/casl-ability.factory";
import {NotEnoughRightsException} from "../common/exceptions";
import Application from "../application/models/application.model";
import {ApplicationCommentNotFoundException} from "./exceptions";
import {UpdateApplicationCommentDto} from "./dto";

@Injectable()
export default class ApplicationCommentService {
  constructor(
    @Inject(getModelToken(ApplicationComment))
    private applicationCommentRepository: typeof ApplicationComment,
    @Inject(getModelToken(Application))
    private applicationRepository: typeof Application,
    private abilityFactory: CaslAbilityFactory,
  ) {}

  async create(
    createDto: CreateApplicationCommentDto,
    currentUser: User,
  ): Promise<ApplicationComment> {
    const ability: AppAbility = this.abilityFactory.createForUser(currentUser);
    const hasAccess: boolean = ability.can(Action.Manage, 'all')
      || ability.can(Action.Manage, ApplicationComment)

    if (!hasAccess) {
      throw new NotEnoughRightsException();
    }

    const application = await this.applicationRepository.findOne({
      where: {
        id: createDto.applicationId,
      },
    });
    if (!application) {
      throw new ApplicationNotFoundException();
    }

    const result = await this.applicationCommentRepository.create({
      publisherId: currentUser.id,
      applicationId: application.id,
      message: createDto.message,
    })

    return result;
  }

  async update(
    id: number,
    updateDto: UpdateApplicationCommentDto,
    currentUser: User,
  ): Promise<ApplicationComment> {
    const comment = await this.applicationCommentRepository.findByPk(id);

    if (!comment) {
      throw new ApplicationCommentNotFoundException();
    }

    const ability: AppAbility = this.abilityFactory.createForUser(currentUser);
    const hasAccess: boolean = ability.can(Action.Update, ApplicationComment);

    if (!hasAccess) {
      throw new NotEnoughRightsException();
    }

    await this.applicationCommentRepository.update(
      {
        message: updateDto.message,
      },
      {
        where: { id: comment.id },
      },
    );

    const result = await this.applicationCommentRepository.findByPk(comment.id);

    return result;
  }
}
