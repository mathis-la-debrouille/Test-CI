import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    const unusedVariable = 'This will cause a lint error';
    return 'Hello World!';
  }
}
