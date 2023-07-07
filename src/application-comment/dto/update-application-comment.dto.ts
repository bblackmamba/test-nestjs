import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export default class UpdateApplicationCommentDto {
  @ApiProperty({ required: true, type: String })
  @Length(3)
  @IsString()
  readonly message: string;
}
