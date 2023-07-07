import { ApiProperty } from '@nestjs/swagger';
import {IsString, Length} from 'class-validator';

export default class CreateApplicationDto {
    @ApiProperty({ required: true, type: String })
    @Length(3)
    @IsString()
    message: string;
}
