import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { FindAllEntitiesDto } from '../../common/dto';
import ApplicationStatusEnum from "../enums/application-status.enum";
import {Type} from "class-transformer";

export default class FindAllApplicationsDto extends FindAllEntitiesDto {
  @ApiProperty({
    required: false,
    type: Number,
    description: 'User',
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly userId?: number;

  @ApiProperty({
    required: false,
    example: ApplicationStatusEnum.Active,
    enum: ApplicationStatusEnum,
  })
  @IsOptional()
  @IsEnum(ApplicationStatusEnum)
  readonly status?: ApplicationStatusEnum;
}
