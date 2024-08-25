import { Test } from '@nestjs/testing';
import { DrizzleUserRepository } from './drizzle-user.repository';
import { User } from '@domain/entities/user';
import { DatabaseModule } from '@infra/db/database.module';
import { ConfigModule } from '@nestjs/config';
import { StartedTestContainer } from 'testcontainers';
import { getDbContainer } from '@test/helpers/get-db-container';
import { UserId } from '@domain/value-objects/user-id';

describe('DrizzleUserRepository spec', () => {
  let drizzleUserRepository: DrizzleUserRepository;
  let dbContainer: StartedTestContainer;

  beforeEach(async () => {
    const { instance, connectionString } = await getDbContainer();
    dbContainer = instance;
    process.env.DATABASE_URL = connectionString;

    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        DatabaseModule,
      ],
      providers: [DrizzleUserRepository],
    }).compile();
    drizzleUserRepository = moduleRef.get<DrizzleUserRepository>(
      DrizzleUserRepository,
    );
  }, 10000);

  afterEach(async () => {
    await dbContainer.exec(
      'psql -c "TRUNCATE TABLE img-mgr.users;" -U img-mgr',
    );
  });
  afterAll(async () => {
    await dbContainer.stop();
  });

  function createUserEntity(
    overrides?: Partial<{
      id: UserId;
      username: string;
      email: string;
      password: string;
    }>,
  ) {
    return new User({
      username: overrides?.username ?? 'test',
      email: overrides?.email ?? 'test',
      password: overrides?.password ?? 'test',
      id: overrides?.id.value ?? undefined,
    });
  }

  test('Creates an user', async () => {
    const userToCreate = createUserEntity();
    const user = await drizzleUserRepository.create(userToCreate);
    expect(user.id.value).toBeDefined();
    expect(user.id.value).not.toBeNull();
    expect(user.username).toBe('test');
    expect(user.email).toBe('test');
    expect(user.password).toBe('test');
  });

  test('Can find users by id', async () => {
    const userToCreate = createUserEntity();
    const user = await drizzleUserRepository.create(userToCreate);
    const foundUser = await drizzleUserRepository.findById(user.id);
    expect(foundUser).toEqual(user);
  });

  test('Deletes an user', async () => {
    const userToCreate = createUserEntity();
    const user = await drizzleUserRepository.create(userToCreate);
    await drizzleUserRepository.delete(user.id);
    const foundUser = await drizzleUserRepository.findById(user.id);
    expect(foundUser).toBeNull();
  });

  test('Saving an new user results in a new row', async () => {
    const userToCreate = createUserEntity();
    const user = await drizzleUserRepository.save(userToCreate);
    expect(user.id.value).toBeDefined();
    expect(user.id.value).not.toBeNull();
    expect(user.username).toBe('test');
    expect(user.email).toBe('test');
    expect(user.password).toBe('test');
  });

  test('Saving an existing user updates the row', async () => {
    const userToCreate = createUserEntity();
    const user = await drizzleUserRepository.save(userToCreate);
    const rawUserId = user.id.value;

    const userToUpdate = createUserEntity({
      id: new UserId(rawUserId),
      username: 'new-test',
      email: 'new-test',
      password: 'new-test',
    });
    console.log(userToUpdate);
    const updatedUser = await drizzleUserRepository.save(userToUpdate);
    expect(updatedUser.username).toBe('new-test');
    expect(updatedUser.email).toBe('new-test');
    expect(updatedUser.password).toBe('new-test');
    expect(updatedUser.id.value).toBe(rawUserId);
  });
});
