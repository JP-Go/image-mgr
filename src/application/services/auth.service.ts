import { User } from '../domain/entities/user';

export type AuthenticationResponse = Omit<User, 'password'> & {
  token: string;
  expiresAt: Date;
};

export abstract class AuthService {
  abstract validateUser(user: User): Promise<AuthenticationResponse>;
  abstract singUp(user: User): Promise<AuthenticationResponse>;
}
