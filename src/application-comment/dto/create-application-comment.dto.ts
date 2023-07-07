import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Length } from 'class-validator';

export default class CreateApplicationCommentDto {
  @ApiProperty({ required: true, type: Number })
  @IsNumber()
  readonly applicationId: number;

  @ApiProperty({ required: true, type: String })
  @Length(3)
  @IsString()
  readonly message: string;
}
