import { randomUUID } from 'crypto';
import { validate } from 'uuid';

export class UUID {
  private _value: string;

  constructor(value: string | null) {
    if (!value) {
      this._value = randomUUID();
    } else {
      if (!this.isValid(value)) {
        this._value = null;
      }
      this._value = value;
    }
  }

  static new(): UUID {
    return new UUID(randomUUID());
  }

  private isValid(value: string) {
    return validate(value);
  }

  equals(other: UUID): boolean {
    if (other === null || other === undefined) {
      return false;
    }
    if (other === this) {
      return true;
    }

    return this._value === other.value;
  }

  toString(): string {
    return this._value;
  }

  get value() {
    return this._value;
  }
}
