import { ApiProperty } from '@nestjs/swagger';
import Application from "../models/application.model";

export default class ApplicationsDto {
  @ApiProperty({ type: [Application] })
  rows: Application[];

  @ApiProperty({ example: '1' })
  count: number;
}
