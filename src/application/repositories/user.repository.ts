import { User } from '../domain/entities/user';
import { UserId } from '../domain/value-objects/user-id';

/* Using abstract classes because Nest.Js requires a concrete JS Object to inject it */
export abstract class UserRepository {
  abstract findById(userId: UserId): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract delete(userId: UserId): Promise<void>;
  abstract save(user: User): Promise<User>;
  abstract create(user: User): Promise<User>;
}
