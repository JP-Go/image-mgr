import { Injectable } from '@nestjs/common';
import { PasswordHasher } from './password-hasher';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptPasswordHasher implements PasswordHasher {
  async verify(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
}
