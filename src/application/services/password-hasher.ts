export abstract class PasswordHasher {
  abstract hash(password: string): Promise<string>;
  abstract verify(password: string, hashedPassword: string): Promise<boolean>;
}
