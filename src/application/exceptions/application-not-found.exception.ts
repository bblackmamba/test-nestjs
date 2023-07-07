import { HttpStatus, HttpException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export default class ApplicationNotFoundException extends HttpException {
  static statusCode: number = HttpStatus.NOT_FOUND;

  static message = 'Application not found.';

  @ApiProperty({ required: true, example: ApplicationNotFoundException.statusCode })
    statusCode: number = ApplicationNotFoundException.statusCode;

  @ApiProperty({ required: true, example: ApplicationNotFoundException.message })
    message: string = ApplicationNotFoundException.message;

  constructor() {
    super(ApplicationNotFoundException.message, ApplicationNotFoundException.statusCode);
  }
}
