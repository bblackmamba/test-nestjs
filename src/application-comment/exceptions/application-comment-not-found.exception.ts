import { HttpStatus, HttpException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export default class ApplicationCommentNotFoundException extends HttpException {
  static statusCode: number = HttpStatus.NOT_FOUND;

  static message = 'Application comment not found.';

  @ApiProperty({ required: true, example: ApplicationCommentNotFoundException.statusCode })
    statusCode: number = ApplicationCommentNotFoundException.statusCode;

  @ApiProperty({ required: true, example: ApplicationCommentNotFoundException.message })
    message: string = ApplicationCommentNotFoundException.message;

  constructor() {
    super(ApplicationCommentNotFoundException.message, ApplicationCommentNotFoundException.statusCode);
  }
}
