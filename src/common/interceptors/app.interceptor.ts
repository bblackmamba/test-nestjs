import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { catchError, Observable } from 'rxjs';
import {
  DefaultException,
  NotEnoughRightsException,
  UnauthorizedException,
  BadRequestException,
} from '../exceptions';
import { UserNotFoundException } from '../../user/exceptions';
import { ApplicationNotFoundException } from "../../application/exceptions";
import { TokenNotFoundException } from "../../token/exceptions";
import { RoleNotFoundException } from "../../role/exceptions";

const exceptions = [
  // User
  UserNotFoundException,

  // Application
  ApplicationNotFoundException,

  // Token
  TokenNotFoundException,

  // Role
  RoleNotFoundException,

  // Common
  BadRequestException,
  DefaultException,
  UnauthorizedException,
  NotEnoughRightsException,
];

@Injectable()
export default class AppInterceptor implements NestInterceptor {
  // eslint-disable-next-line class-methods-use-this
  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    return next
      .handle()
      .pipe(
        catchError((err) => {
          if (exceptions.some((exception) => err instanceof exception)) {
            throw err;
          }

          throw new DefaultException();
        }),
      );
  }
}
