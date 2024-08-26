import { User } from '@domain/entities/user';
import { UUID } from '@domain/value-objects/uuid';

/* Using abstract classes because Nest.Js requires a concrete JS Object to inject it */
export abstract class UserRepository {
  abstract findById(userId: UUID): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract delete(userId: UUID): Promise<void>;
  abstract save(user: User): Promise<User>;
  abstract create(user: User): Promise<User>;
}
