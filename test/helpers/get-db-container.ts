import { GenericContainer } from 'testcontainers';

export const getDbContainer = async () => {
  const dbContainer = await new GenericContainer('postgres:16-alpine')
    .withExposedPorts(5432)
    .withEnvironment({
      POSTGRES_USER: 'img-mgr',
      POSTGRES_PASSWORD: 'img-mgr',
      POSTGRES_DB: 'img-mgr',
    })
    .withCopyDirectoriesToContainer([
      {
        source: 'drizzle/',
        target: '/docker-entrypoint-initdb.d',
      },
    ])

    .start();

  return {
    instance: dbContainer,
    connectionString: `postgres://img-mgr:img-mgr@${dbContainer.getHost()}:${dbContainer.getMappedPort(5432)}/img-mgr`,
  };
};
