import {
  HttpCode,
  HttpStatus,
  Param,
  Request,
  Delete,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import AuthController from '../common/decorators/auth-controller.decorator';
import UserService from './user.service';
import { AuthRequest, StatusDto } from '../common/dto';
import {UserNotFoundException} from "./exceptions";

@AuthController('users')
export default class UserController {
  constructor(private readonly userService: UserService) {}
  @ApiOperation({ description: 'Delete user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Status',
    type: StatusDto,
  })
  @ApiResponse({
    status: UserNotFoundException.statusCode,
    description: UserNotFoundException.message,
    type: UserNotFoundException,
  })
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  delete(
    @Param('id') id: number,
      @Request() request: AuthRequest,
  ): Promise<StatusDto> {
    return this.userService.delete(id, request.currentUser);
  }
}
