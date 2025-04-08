import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    const unusedVariable = 'This will cause a lint error';
    return 'Hello World!';
  }

  getHello2(): string {
    const unusedVariable2 = 'This will cause another lint error';
    return 'Hello World!';
  }
}
