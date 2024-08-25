import { UserRepository } from '@app/repositories/user.repository';
import { User } from '../domain/entities/user';
import { PasswordHasher } from './password-hasher';
import { Injectable } from '@nestjs/common';

export abstract class AuthService {
  abstract validateUser(credentials: {
    email: string;
    password: string;
  }): Promise<User>;
  abstract singUp(user: User): Promise<User>;
}

// TODO: implement test for this service
// TODO: move this implementation to another file
@Injectable()
export class GenericAuthService implements AuthService {
  constructor(
    private userRepository: UserRepository,
    private hasher: PasswordHasher,
  ) {}

  async validateUser({ email, password }): Promise<User | null> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      return null;
    }

    const isPasswordValid = await this.hasher.verify(password, user.password);
    if (!isPasswordValid) {
      return null;
    }
    return user;
  }

  async singUp(user: User): Promise<User | null> {
    const emailTaken =
      (await this.userRepository.findByEmail(user.email)) !== null;
    if (emailTaken) {
      return this.validateUser(user);
    }

    const hashedPassword = await this.hasher.hash(user.password);
    const savedUser = await this.userRepository.create(
      new User({
        email: user.email,
        username: user.username,
        password: hashedPassword,
      }),
    );
    return savedUser;
  }
}
