import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import ApplicationStatusEnum from "../enums/application-status.enum";

export default class UpdateStatusDto {
  @ApiProperty({
    required: false,
    example: ApplicationStatusEnum.Active,
    enum: ApplicationStatusEnum,
  })
  @IsEnum(ApplicationStatusEnum)
  readonly status?: ApplicationStatusEnum;
}
