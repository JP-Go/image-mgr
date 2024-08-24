import { randomUUID } from 'crypto';
import { validate } from 'uuid';

export class UserId {
  constructor(private readonly value?: string) {
    if (!value) {
      this.value = randomUUID();
    } else {
      if (!this.isValid(value)) {
        throw new Error('Invalid UUID');
      }
      this.value = value;
    }
  }

  static new(): UserId {
    return new UserId(randomUUID());
  }

  private isValid(value: string) {
    return validate(value);
  }

  equals(other: UserId): boolean {
    if (other === null || other === undefined) {
      return false;
    }
    if (other === this) {
      return true;
    }

    return this.value === other.value;
  }
}
