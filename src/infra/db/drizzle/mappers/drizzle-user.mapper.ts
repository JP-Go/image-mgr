import { User } from '@app/domain/entities/user';
import { user as DbUser } from '../schema/user';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DrizzleUserMapper {
  static toDomain(user: typeof DbUser.$inferSelect): User | null {
    return user === undefined
      ? null
      : new User({
          id: user.id,
          username: user.username,
          email: user.email,
          password: user.password,
        });
  }

  static toPersistence(
    user: User,
  ): typeof DbUser.$inferInsert & { id?: string } {
    return {
      id: user.id.value,
      username: user.username,
      email: user.email,
      password: user.password,
    };
  }
}
