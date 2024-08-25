import { User } from '@app/domain/entities/user';
import { UserId } from '@app/domain/value-objects/user-id';
import { UserRepository } from '@app/repositories/user.repository';
import * as schema from '../schema/user';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DrizzleUserMapper } from '../mappers/drizzle-user.mapper';

export class DrizzleUserRepository implements UserRepository {
  constructor(
    @Inject('DRIZZLE_DB')
    private readonly db: PostgresJsDatabase<typeof schema>,
  ) {}

  // TODO: implement test for this method
  async findByEmail(email: string): Promise<User | null> {
    const dbUser = await this.db.query.user.findFirst({
      where: eq(schema.user.email, email),
    });
    return DrizzleUserMapper.toDomain(dbUser);
  }

  async findById(userId: UserId): Promise<User | null> {
    const dbUser = await this.db.query.user.findFirst({
      where: eq(schema.user.id, userId.toString()),
    });
    return DrizzleUserMapper.toDomain(dbUser);
  }

  async delete(userId: UserId): Promise<void> {
    await this.db
      .delete(schema.user)
      .where(eq(schema.user.id, userId.toString()));
  }

  async create(user: User): Promise<User> {
    const insertData = DrizzleUserMapper.toPersistence(user);
    const [newUser] = await this.db
      .insert(schema.user)
      .values(insertData)
      .returning();
    return DrizzleUserMapper.toDomain(newUser);
  }

  async save(user: User): Promise<User> {
    const insertData = DrizzleUserMapper.toPersistence(user);
    const [newUser] = await this.db
      .insert(schema.user)
      .values(insertData)
      .onConflictDoUpdate({
        target: schema.user.id,
        set: insertData,
      })
      .returning();
    return DrizzleUserMapper.toDomain(newUser);
  }
}
