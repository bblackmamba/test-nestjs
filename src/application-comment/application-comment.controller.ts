import {
  Body,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Request,
} from '@nestjs/common';
import ApplicationCommentService from "./application-comment.service";
import ApplicationComment from "./models/application-comment.model";
import {
  CreateApplicationCommentDto,
  UpdateApplicationCommentDto,
} from './dto';
import { AuthRequest } from "../common/dto";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import Application from "../application/models/application.model";
import { ApplicationNotFoundException } from "../application/exceptions";
import { AuthController } from "../common/decorators";

@AuthController('application-comments')
export class ApplicationCommentController {
  constructor(private readonly applicationCommentService: ApplicationCommentService) {}

  @ApiOperation({ description: 'Create application comment' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Created application comment',
    type: ApplicationComment,
  })
  @HttpCode(HttpStatus.OK)
  @Post()
  create(
    @Body()createDto: CreateApplicationCommentDto,
    @Request() request: AuthRequest,
  ): Promise<ApplicationComment> {
    return this.applicationCommentService.create(createDto, request.currentUser);
  }

  @ApiOperation({ description: 'Update application' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Updated application',
    type: Application,
  })
  @ApiResponse({
    status: ApplicationNotFoundException.statusCode,
    description: ApplicationNotFoundException.message,
    type: ApplicationNotFoundException,
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateApplicationCommentDto,
    @Request() request: AuthRequest,
  ): Promise<ApplicationComment> {
    return this.applicationCommentService.update(Number(id), updateDto, request.currentUser);
  }
}
