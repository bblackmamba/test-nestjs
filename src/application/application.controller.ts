import {
  Body, Delete, Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post, Query,
  Request,
} from '@nestjs/common';
import ApplicationService from "./application.service";
import Application from "./models/application.model";
import { AuthController } from "../common/decorators";
import {ApplicationsDto, CreateApplicationDto, FindAllApplicationsDto, UpdateStatusDto} from "./dto";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import {AuthRequest, StatusDto} from "../common/dto";
import { ApplicationNotFoundException } from "./exceptions";

@AuthController('applications')
export class ApplicationController {
constructor(private readonly applicationService: ApplicationService) {}

  @ApiOperation({ description: 'Get applications' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Applications',
    type: ApplicationsDto,
  })
  @HttpCode(HttpStatus.OK)
  @Get()
  findAll(
    @Query() findAllDto: FindAllApplicationsDto,
    @Request() request: AuthRequest,
  ): Promise<ApplicationsDto> {
    return this.applicationService.findAll(findAllDto, request.currentUser);
  }

  @ApiOperation({ description: 'Create application' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Created application',
    type: Application,
  })
  @HttpCode(HttpStatus.OK)
  @Post()
  create(
    @Body() createDto: CreateApplicationDto,
    @Request() request: AuthRequest,
  ): Promise<Application> {
    return this.applicationService.create(createDto, request.currentUser);
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
    @Body() updateDto: CreateApplicationDto,
    @Request() request: AuthRequest,
  ): Promise<Application> {
    return this.applicationService.update(Number(id), updateDto, request.currentUser);
  }

  @ApiOperation({ description: 'Update status application' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Updated status application',
    type: Application,
  })
  @ApiResponse({
    status: ApplicationNotFoundException.statusCode,
    description: ApplicationNotFoundException.message,
    type: ApplicationNotFoundException,
  })
  @Patch('status/:id')
  updateStatus(
    @Param('id') id: string,
    @Body() updateDto: UpdateStatusDto,
    @Request() request: AuthRequest,
  ): Promise<Application> {
    return this.applicationService.updateStatus(Number(id), updateDto, request.currentUser);
  }
  @ApiOperation({ description: 'Delete application' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Delete application',
    type: StatusDto,
  })
  @ApiResponse({
    status: ApplicationNotFoundException.statusCode,
    description: ApplicationNotFoundException.message,
    type: ApplicationNotFoundException,
  })
  @Delete(':id')
  delete(
    @Param('id') id: string,
    @Request() request: AuthRequest,
    ): Promise<StatusDto> {
    return this.applicationService.delete(Number(id), request.currentUser);
  }
}
