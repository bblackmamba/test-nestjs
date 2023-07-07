import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import User from '../user/models/user.model';
import RolesEnum from '../role/enums/roles.enum';
import Application from "../application/models/application.model";
import ApplicationComment from "../application-comment/models/application-comment.model";

export enum Action {
  Manage = 'manage',
  Update = 'update',
  Delete = 'delete',
}

type Subjects = InferSubjects<
  typeof User
| typeof Application
| typeof ApplicationComment
> | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  // eslint-disable-next-line class-methods-use-this
  createForUser(user: User): AppAbility {
    const { can, build } = new AbilityBuilder<
    Ability<[Action, Subjects]>
    >(Ability as AbilityClass<AppAbility>);

    if (user.role.name === RolesEnum.Admin) {
      can(Action.Manage, 'all');
    }

    can(Action.Delete, Application, { publisherId: user.id });

    can(Action.Update, ApplicationComment, { publisherId: user.id });

    return build({
      detectSubjectType: (item) => item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
